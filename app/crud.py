# app/crud.py
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from datetime import datetime, date
from typing import Optional, List, Dict
from . import models, schemas

# ----------------------
# Helper: Convert SQLAlchemy object to Pydantic schema
# ----------------------
def to_prereg_response(req: models.PreregistrationRequest) -> schemas.PreregRequestResponse:
    """Convert SQLAlchemy PreregistrationRequest to Pydantic response"""
    # Ensure department is loaded
    department_name = "Unknown"
    if req.department:
        department_name = req.department.name
    
    # Get doctor name if assigned
    assigned_doctor_name = None
    if req.accepted_by_doctor and req.accepted_by_doctor.name:
        assigned_doctor_name = req.accepted_by_doctor.name
    
    # Get assigned slot if available
    assigned_slot = None
    if req.accepted_by_doctor_id and req.preferred_date:
        # Try to find the reserved slot
        availability = get_availability_by_doctor_date(Session.object_session(req), req.accepted_by_doctor_id, req.preferred_date)
        if availability and availability.time_slots:
            # Find which slot was reserved (based on reserved_count)
            slot_index = availability.reserved_count - 1  # -1 because we increment after reserving
            if 0 <= slot_index < len(availability.time_slots):
                assigned_slot = availability.time_slots[slot_index]
    
    # Convert status properly
    status_value = req.status.value if hasattr(req.status, 'value') else str(req.status)
    
    return schemas.PreregRequestResponse(
        id=req.id,
        patient_id=req.patient_id,
        status=status_value,
        department_id=req.department_id,
        department=department_name,
        department_confidence=float(req.department_confidence) if req.department_confidence else 0.0,
        preferred_date=req.preferred_date,
        created_at=req.created_at,
        assigned_doctor_id=req.accepted_by_doctor_id,
        assigned_doctor_name=assigned_doctor_name,
        assigned_slot=assigned_slot
    )

# ----------------------
# Create a prereg request 
# ----------------------
def create_prereg_request(
    db: Session,
    patient_id: int,
    obj_in: schemas.CreatePreregRequest,
    department_id: int,
    department_confidence: float
):
    """Create a new pre-registration request with automatic doctor assignment"""
    print(f"DEBUG: Creating request - Patient: {patient_id}, Department: {department_id}, Date: {obj_in.preferred_date}")
    
    # 1. Verify department exists
    department = db.query(models.Department).filter(models.Department.id == department_id).first()
    if not department:
        raise ValueError(f"Department with ID {department_id} not found")
    
    print(f"DEBUG: Department found: {department.name}")
    
    # 2. Find doctors in this department
    doctors = db.query(models.Doctor).filter(
        models.Doctor.department_id == department_id
    ).all()
    
    print(f"DEBUG: Found {len(doctors)} doctors in department {department.name}")
    
    assigned_doctor_id = None
    assigned_slot_info = None
    
    if doctors:
        # 3. Check each doctor's availability for the preferred date
        available_doctors = []
        
        for doctor in doctors:
            print(f"DEBUG: Checking availability for Dr. {doctor.name} (ID: {doctor.id})")
            
            # Check doctor's availability for this date
            availability = db.query(models.DoctorAvailability).filter(
                models.DoctorAvailability.doctor_id == doctor.id,
                models.DoctorAvailability.slot_date == obj_in.preferred_date
            ).first()
            
            if availability:
                print(f"DEBUG: Dr. {doctor.name} has availability with {len(availability.time_slots)} slots, {availability.reserved_count} reserved")
                
                # Check if doctor has available slots
                if availability.reserved_count < len(availability.time_slots):
                    # Check doctor's max slots per day
                    today_requests_count = db.query(models.PreregistrationRequest).filter(
                        models.PreregistrationRequest.accepted_by_doctor_id == doctor.id,
                        models.PreregistrationRequest.preferred_date == obj_in.preferred_date,
                        models.PreregistrationRequest.status.in_(['accepted', 'scheduled'])
                    ).count()
                    
                    if today_requests_count < doctor.max_slots_per_day:
                        available_doctors.append({
                            'doctor': doctor,
                            'availability': availability,
                            'reserved_count': availability.reserved_count,
                            'total_slots': len(availability.time_slots),
                            'today_requests': today_requests_count,
                            'available_slots': len(availability.time_slots) - availability.reserved_count
                        })
                        print(f"DEBUG: Dr. {doctor.name} has {len(availability.time_slots) - availability.reserved_count} available slots")
        
        print(f"DEBUG: Found {len(available_doctors)} available doctors")
        
        # 4. Select the best doctor (one with most available slots)
        if available_doctors:
            # Sort by: 1) Most available slots, 2) Fewest requests today
            available_doctors.sort(key=lambda x: (-x['available_slots'], x['today_requests']))
            
            selected = available_doctors[0]
            assigned_doctor = selected['doctor']
            availability = selected['availability']
            assigned_doctor_id = assigned_doctor.id
            
            print(f"DEBUG: Selected Dr. {assigned_doctor.name} with {selected['available_slots']} available slots")
            
            # 5. Reserve a slot
            slot_index = availability.reserved_count
            if slot_index < len(availability.time_slots):
                assigned_slot_info = availability.time_slots[slot_index]
                availability.reserved_count += 1
                db.add(availability)
                print(f"DEBUG: Reserved slot {slot_index + 1}/{len(availability.time_slots)}: {assigned_slot_info}")
    
    # 6. Create the request
    db_request = models.PreregistrationRequest(
        patient_id=patient_id,
        symptoms=obj_in.symptoms,
        preferred_date=obj_in.preferred_date,
        status=models.PreregStatus.PENDING,
        department_id=department_id,
        department_confidence=department_confidence,
        accepted_by_doctor_id=assigned_doctor_id,
        created_at=datetime.utcnow()
    )
    
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    
    print(f"DEBUG: Request created with ID: {db_request.id}, Doctor assigned: {assigned_doctor_id}")
    
    # 7. Load with relationships for response
    db_request = db.query(models.PreregistrationRequest).options(
        joinedload(models.PreregistrationRequest.department),
        joinedload(models.PreregistrationRequest.accepted_by_doctor)
    ).filter(models.PreregistrationRequest.id == db_request.id).first()
    
    # 8. Get the assigned slot info for response
    response = to_prereg_response(db_request)
    
    # Override assigned_slot with the one we reserved
    if assigned_slot_info:
        response.assigned_slot = assigned_slot_info
    
    return response

# ----------------------
# APPOINTMENT CRUD FUNCTIONS - NEW
# ----------------------

def create_appointment_from_request(db: Session, request_id: int, doctor_id: int):
    """Create an appointment when a request is accepted"""
    # Get the request with relationships
    req = db.query(models.PreregistrationRequest).options(
        joinedload(models.PreregistrationRequest.department),
        joinedload(models.PreregistrationRequest.accepted_by_doctor)
    ).filter(models.PreregistrationRequest.id == request_id).first()
    
    if not req:
        raise ValueError(f"Request {request_id} not found")
    
    if req.accepted_by_doctor_id != doctor_id:
        raise ValueError(f"Doctor {doctor_id} is not assigned to request {request_id}")
    
    # Get doctor availability for this date
    availability = db.query(models.DoctorAvailability).filter(
        models.DoctorAvailability.doctor_id == doctor_id,
        models.DoctorAvailability.slot_date == req.preferred_date
    ).first()
    
    if not availability:
        raise ValueError(f"No availability found for doctor {doctor_id} on {req.preferred_date}")
    
    # Find which slot was reserved (based on reserved_count - 1)
    slot_index = availability.reserved_count - 1
    if slot_index < 0 or slot_index >= len(availability.time_slots):
        raise ValueError(f"No available slot found")
    
    slot_info = availability.time_slots[slot_index]
    
    # Create datetime objects for start and end times
    try:
        start_datetime = datetime.combine(
            req.preferred_date,
            datetime.strptime(slot_info["start"], "%H:%M").time()
        )
        end_datetime = datetime.combine(
            req.preferred_date,
            datetime.strptime(slot_info["end"], "%H:%M").time()
        )
    except ValueError:
        # Fallback if time format is different
        start_datetime = datetime.combine(req.preferred_date, datetime.min.time())
        end_datetime = datetime.combine(req.preferred_date, datetime.min.time())
    
    # Check if appointment already exists for this request
    existing_appointment = db.query(models.Appointment).filter(
        models.Appointment.request_id == request_id
    ).first()
    
    if existing_appointment:
        # Update existing appointment
        existing_appointment.doctor_id = doctor_id
        existing_appointment.department_id = req.department_id
        existing_appointment.reserved_slot_id = availability.id
        existing_appointment.start_time = start_datetime
        existing_appointment.end_time = end_datetime
        existing_appointment.status = models.PreregStatus.SCHEDULED
        db.commit()
        db.refresh(existing_appointment)
        return existing_appointment
    
    # Create new appointment
    appointment = models.Appointment(
        request_id=request_id,
        doctor_id=doctor_id,
        department_id=req.department_id,
        reserved_slot_id=availability.id,
        start_time=start_datetime,
        end_time=end_datetime,
        status=models.PreregStatus.SCHEDULED,
        created_at=datetime.utcnow()
    )
    
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    
    return appointment

def get_appointments_by_doctor(db: Session, doctor_id: int, status: Optional[str] = None):
    """Get all appointments for a doctor, optionally filtered by status"""
    query = db.query(models.Appointment).options(
        joinedload(models.Appointment.request),
        joinedload(models.Appointment.doctor),
        joinedload(models.Appointment.department)
    ).filter(models.Appointment.doctor_id == doctor_id)
    
    if status:
        query = query.filter(models.Appointment.status == status)
    
    return query.order_by(models.Appointment.start_time).all()

def update_appointment_status(db: Session, appointment_id: int, status: models.PreregStatus):
    """Update appointment status (e.g., to COMPLETED)"""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id
    ).first()
    
    if not appointment:
        return None
    
    appointment.status = status
    db.commit()
    db.refresh(appointment)
    
    # Also update the associated request status
    request = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == appointment.request_id
    ).first()
    
    if request:
        request.status = status
        db.commit()
    
    return appointment

def cancel_appointment_by_doctor_v2(db: Session, appointment_id: int, doctor_id: int, reason: str = None):
    """Cancel an appointment (doctor side) - UPDATED VERSION"""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.doctor_id == doctor_id,
        models.Appointment.status.in_([models.PreregStatus.SCHEDULED, models.PreregStatus.ACCEPTED])
    ).first()
    
    if not appointment:
        return None
    
    # Update appointment status
    appointment.status = models.PreregStatus.CANCELLED
    db.commit()
    
    # Update the associated request
    request = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == appointment.request_id
    ).first()
    
    if request:
        request.status = models.PreregStatus.CANCELLED
        request.decline_reason = reason or "Cancelled by doctor"
        db.commit()
    
    # Free up the reserved slot
    if appointment.reserved_slot_id:
        availability = db.query(models.DoctorAvailability).filter(
            models.DoctorAvailability.id == appointment.reserved_slot_id
        ).first()
        
        if availability and availability.reserved_count > 0:
            availability.reserved_count -= 1
            db.commit()
    
    return appointment

def get_appointment_by_id(db: Session, appointment_id: int):
    """Get appointment by ID with relationships"""
    return db.query(models.Appointment).options(
        joinedload(models.Appointment.request),
        joinedload(models.Appointment.doctor),
        joinedload(models.Appointment.department)
    ).filter(models.Appointment.id == appointment_id).first()

# ----------------------
# Helper functions for availability
# ----------------------
def get_availability_by_doctor_date(db: Session, doctor_id: int, slot_date: date):
    return db.query(models.DoctorAvailability).filter(
        models.DoctorAvailability.doctor_id == doctor_id,
        models.DoctorAvailability.slot_date == slot_date
    ).first()

# ----------------------
# Get doctor by ID
# ----------------------
def get_doctor(db: Session, doctor_id: int):
    return db.query(models.Doctor).options(
        joinedload(models.Doctor.department)
    ).filter(models.Doctor.id == doctor_id).first()

# ----------------------
# Other existing functions 
# ----------------------
def get_prereg_requests_by_patient(
    db: Session, 
    patient_id: int, 
    status: Optional[str] = None
):
    query = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.patient_id == patient_id
    ).options(
        joinedload(models.PreregistrationRequest.department),
        joinedload(models.PreregistrationRequest.accepted_by_doctor)
    )
    
    if status:
        query = query.filter(models.PreregistrationRequest.status == status)
    
    reqs = query.order_by(models.PreregistrationRequest.created_at.desc()).all()
    return [to_prereg_response(r) for r in reqs]

def get_prereg_request_by_id(db: Session, request_id: int):
    req = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == request_id
    ).options(
        joinedload(models.PreregistrationRequest.department),
        joinedload(models.PreregistrationRequest.accepted_by_doctor)
    ).first()
    return to_prereg_response(req) if req else None

# ----------------------
# Get all requests
# ----------------------
def get_all_requests(db: Session, status: Optional[str] = None):
    query = db.query(models.PreregistrationRequest).options(
        joinedload(models.PreregistrationRequest.department),
        joinedload(models.PreregistrationRequest.accepted_by_doctor)
    )
    
    if status:
        query = query.filter(models.PreregistrationRequest.status == status)
    
    reqs = query.order_by(models.PreregistrationRequest.created_at.desc()).all()
    return [to_prereg_response(r) for r in reqs]

# ----------------------
# DEPARTMENT CRUD FUNCTIONS 
# ----------------------
def create_department(db: Session, dept: schemas.CreateDepartment):
    """Create a new department"""
    # Check if department with same name exists
    existing = db.query(models.Department).filter(
        func.lower(models.Department.name) == func.lower(dept.name)
    ).first()
    
    if existing:
        raise ValueError(f"Department with name '{dept.name}' already exists")
    
    db_dept = models.Department(
        name=dept.name,
        keyword_mappings=dept.keyword_mappings
    )
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

def get_department(db: Session, department_id: int):
    return db.query(models.Department).filter(models.Department.id == department_id).first()

def get_all_departments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Department).offset(skip).limit(limit).all()

def update_department(db: Session, department_id: int, dept_update: schemas.CreateDepartment):
    db_dept = get_department(db, department_id)
    if not db_dept:
        return None
    
    for field, value in dept_update.dict().items():
        setattr(db_dept, field, value)
    
    db.commit()
    db.refresh(db_dept)
    return db_dept

def delete_department(db: Session, department_id: int):
    db_dept = get_department(db, department_id)
    if not db_dept:
        return None
    
    # Check if department has doctors or requests
    has_doctors = db.query(models.Doctor).filter(models.Doctor.department_id == department_id).first()
    has_requests = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.department_id == department_id
    ).first()
    
    if has_doctors or has_requests:
        raise ValueError("Cannot delete department with associated doctors or requests")
    
    db.delete(db_dept)
    db.commit()
    return True

# ----------------------
# DOCTOR CRUD FUNCTIONS 
# ----------------------
def create_doctor(db: Session, doctor: schemas.CreateDoctor):
    """Create a new doctor"""
    # Check if department exists
    dept = get_department(db, doctor.department_id)
    if not dept:
        raise ValueError(f"Department with ID {doctor.department_id} not found")
    
    db_doctor = models.Doctor(
        name=doctor.name,
        department_id=doctor.department_id,
        max_slots_per_day=doctor.max_slots_per_day
    )
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

def get_doctors_by_department(db: Session, department_id: int):
    return db.query(models.Doctor).options(
        joinedload(models.Doctor.department)
    ).filter(models.Doctor.department_id == department_id).all()

def get_all_doctors(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Doctor).options(
        joinedload(models.Doctor.department)
    ).offset(skip).limit(limit).all()

# ----------------------
# AVAILABILITY CRUD FUNCTIONS 
def create_availability(db: Session, availability: schemas.CreateAvailability):
    """Create/Update doctor availability"""
    # Check if doctor exists
    doctor = get_doctor(db, availability.doctor_id)
    if not doctor:
        raise ValueError(f"Doctor with ID {availability.doctor_id} not found")
    
    # Check if availability already exists for this date
    existing = db.query(models.DoctorAvailability).filter(
        models.DoctorAvailability.doctor_id == availability.doctor_id,
        models.DoctorAvailability.slot_date == availability.slot_date
    ).first()
    
    if existing:
        # Update existing
        existing.time_slots = availability.time_slots
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Create new
        db_availability = models.DoctorAvailability(
            doctor_id=availability.doctor_id,
            slot_date=availability.slot_date,
            time_slots=availability.time_slots,
            reserved_count=0
        )
        db.add(db_availability)
        db.commit()
        db.refresh(db_availability)
        return db_availability

def get_doctor_availabilities(db: Session, doctor_id: int, start_date: date = None, end_date: date = None):
    query = db.query(models.DoctorAvailability).filter(
        models.DoctorAvailability.doctor_id == doctor_id
    )
    
    if start_date:
        query = query.filter(models.DoctorAvailability.slot_date >= start_date)
    if end_date:
        query = query.filter(models.DoctorAvailability.slot_date <= end_date)
    
    return query.order_by(models.DoctorAvailability.slot_date).all()

def update_request(db: Session, request_id: int, update_data: schemas.UpdatePreregRequest):
    req = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == request_id
    ).first()
    
    if not req:
        return None
    
    update_dict = update_data.dict(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(req, field, value)
    
    db.commit()
    
    # Reload with relationships
    req = db.query(models.PreregistrationRequest).options(
        joinedload(models.PreregistrationRequest.department),
        joinedload(models.PreregistrationRequest.accepted_by_doctor)
    ).filter(models.PreregistrationRequest.id == request_id).first()
    
    return to_prereg_response(req)


def update_request_patient(db: Session, request_id: int, update_data: schemas.UpdatePreregRequestPatient):
    req = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == request_id
    ).first()
    
    if not req:
        return None
    
    update_dict = update_data.dict(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(req, field, value)
    
    db.commit()
    
    # Reload with relationships
    req = db.query(models.PreregistrationRequest).options(
        joinedload(models.PreregistrationRequest.department),
        joinedload(models.PreregistrationRequest.accepted_by_doctor)
    ).filter(models.PreregistrationRequest.id == request_id).first()
    
    return to_prereg_response(req)

def cancel_request(db: Session, request_id: int, patient_id: int):
    req = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == request_id,
        models.PreregistrationRequest.patient_id == patient_id,
        models.PreregistrationRequest.status.in_([
            models.PreregStatus.PENDING,
            models.PreregStatus.ACCEPTED,
            models.PreregStatus.SCHEDULED
        ])
    ).first()
    
    if not req:
        return None
    
    req.status = models.PreregStatus.CANCELLED
    db.commit()
    
    # Reload with relationships
    req = db.query(models.PreregistrationRequest).options(
        joinedload(models.PreregistrationRequest.department),
        joinedload(models.PreregistrationRequest.accepted_by_doctor)
    ).filter(models.PreregistrationRequest.id == request_id).first()
    
    return to_prereg_response(req)

def delete_request_by_patient(db: Session, request_id: int, patient_id: int):
    req = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == request_id,
        models.PreregistrationRequest.patient_id == patient_id,
        models.PreregistrationRequest.status == models.PreregStatus.CANCELLED
    ).first()
    
    if not req:
        return None
    
    db.delete(req)
    db.commit()
    return True

def accept_request(db: Session, request_id: int, doctor_id: int):
    """Accept a request and automatically create appointment"""
    req = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == request_id,
        models.PreregistrationRequest.status == models.PreregStatus.PENDING,
        models.PreregistrationRequest.accepted_by_doctor_id == doctor_id
    ).first()
    
    if not req:
        return None
    
    # Update request status
    req.status = models.PreregStatus.ACCEPTED
    db.commit()
    
    # Create appointment automatically
    try:
        appointment = create_appointment_from_request(db, request_id, doctor_id)
        print(f"✅ Created appointment {appointment.id} for request {request_id}")
    except Exception as e:
        print(f"⚠️ Failed to create appointment: {e}")
        # Continue even if appointment creation fails
    
    # Reload with relationships
    req = db.query(models.PreregistrationRequest).options(
        joinedload(models.PreregistrationRequest.department),
        joinedload(models.PreregistrationRequest.accepted_by_doctor)
    ).filter(models.PreregistrationRequest.id == request_id).first()
    
    return to_prereg_response(req)

def decline_request(db: Session, request_id: int, doctor_id: int, reason: str = None):
    req = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == request_id,
        models.PreregistrationRequest.status == models.PreregStatus.PENDING,
        models.PreregistrationRequest.accepted_by_doctor_id == doctor_id
    ).first()
    
    if not req:
        return None
    
    req.status = models.PreregStatus.DECLINED
    req.decline_reason = reason
    db.commit()
    
    # Reload with relationships
    req = db.query(models.PreregistrationRequest).options(
        joinedload(models.PreregistrationRequest.department),
        joinedload(models.PreregistrationRequest.accepted_by_doctor)
    ).filter(models.PreregistrationRequest.id == request_id).first()
    
    return to_prereg_response(req)

def cancel_appointment_by_doctor(db: Session, appointment_id: int, doctor_id: int):
    """Legacy function - use cancel_appointment_by_doctor_v2 instead"""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.doctor_id == doctor_id,
        models.Appointment.status.in_([models.PreregStatus.ACCEPTED, models.PreregStatus.SCHEDULED])
    ).first()
    
    if not appointment:
        return None
    
    appointment.status = models.PreregStatus.CANCELLED
    db.commit()
    db.refresh(appointment)
    return appointment

def delete_request_by_doctor(db: Session, request_id: int, doctor_id: int = None):
    query = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == request_id
    )
    
    if doctor_id:
        query = query.filter(models.PreregistrationRequest.accepted_by_doctor_id == doctor_id)
    
    req = query.first()
    if not req:
        return None
    
    db.delete(req)
    db.commit()
    return True

def get_appointments_by_patient(db: Session, patient_id: int, status: Optional[str] = None):
    """Get all appointments for a patient, optionally filtered by status"""
    query = db.query(models.Appointment).options(
        joinedload(models.Appointment.request),
        joinedload(models.Appointment.doctor),
        joinedload(models.Appointment.department)
    ).filter(models.Appointment.request.has(patient_id=patient_id))
    
    if status:
        query = query.filter(models.Appointment.status == status)
    
    return query.order_by(models.Appointment.start_time).all()

def get_appointment_statistics(db: Session, doctor_id: int):
    """Get appointment statistics for a doctor"""
    appointments = db.query(models.Appointment).filter(
        models.Appointment.doctor_id == doctor_id
    ).all()
    
    stats = {
        "total": len(appointments),
        "scheduled": 0,
        "completed": 0,
        "cancelled": 0,
        "today": 0,
        "upcoming": 0
    }
    
    today = date.today()
    current_time = datetime.now()
    
    for appointment in appointments:
        status = appointment.status.value if hasattr(appointment.status, 'value') else str(appointment.status)
        if status == "scheduled":
            stats["scheduled"] += 1
        elif status == "completed":
            stats["completed"] += 1
        elif status == "cancelled":
            stats["cancelled"] += 1
        
        # Check if appointment is today
        if appointment.start_time.date() == today:
            stats["today"] += 1
        
        # Check if appointment is upcoming (future)
        if appointment.start_time > current_time and status in ["scheduled", "accepted"]:
            stats["upcoming"] += 1
    
    return stats