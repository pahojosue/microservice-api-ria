# app/routers/doctor.py
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional
from datetime import datetime, date, timedelta
from .. import crud, models
from ..database import get_db
from ..schemas import AcceptRequest, DoctorAppointment, PreregRequestResponse, UpdateAppointmentStatus

router = APIRouter(prefix="/api/doctor", tags=["Doctor"])

# ------------------------------
# Get all prereg requests
# ------------------------------
@router.get("/prereg/requests", response_model=list[PreregRequestResponse])
def get_all_requests(
    db: Session = Depends(get_db), 
    status: Optional[str] = Query(None),
    department_id: Optional[int] = Query(None),
    doctor_id: int = Query(..., description="ID of the doctor")
):
    """Get all pre-registration requests for doctor's department"""
    # Get doctor's department
    doctor = crud.get_doctor(db, doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Build query
    query = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.department_id == doctor.department_id
    )
    
    if status:
        query = query.filter(models.PreregistrationRequest.status == status)
    
    # Filter by accepted_by_doctor_id if you want only requests assigned to this doctor
    # query = query.filter(models.PreregistrationRequest.accepted_by_doctor_id == doctor_id)
    
    requests = query.options(
        joinedload(models.PreregistrationRequest.department),
        joinedload(models.PreregistrationRequest.accepted_by_doctor)
    ).order_by(models.PreregistrationRequest.created_at.desc()).all()
    
    return [crud.to_prereg_response(req) for req in requests]

# ------------------------------
# Accept a prereg request & CREATE APPOINTMENT
# ------------------------------
@router.post("/prereg/requests/{request_id}/accept", response_model=AcceptRequest)
def accept_request(
    request_id: int,
    background_tasks: BackgroundTasks,
    doctor_id: int = Query(..., description="ID of the doctor"),
    db: Session = Depends(get_db)
):
    """Accept a request and automatically create appointment"""
    # 1. Accept the request
    req = crud.accept_request(db, request_id, doctor_id)
    if not req:
        raise HTTPException(status_code=400, detail="Cannot accept request")
    
    # 2. Create an appointment
    try:
        appointment = crud.create_appointment_from_request(db, request_id, doctor_id)
        print(f"✅ Created appointment {appointment.id} for request {request_id}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to create appointment: {str(e)}")
    
    # 3. Check remaining slots
    slot = db.query(models.DoctorAvailability).filter(
        models.DoctorAvailability.doctor_id == doctor_id,
        models.DoctorAvailability.slot_date == req.preferred_date
    ).first()
    remaining_slots = len(slot.time_slots) - slot.reserved_count if slot else 0

    return AcceptRequest(
        status="accepted",
        appointment_id=appointment.id,
        start_time=appointment.start_time.isoformat() if appointment.start_time else "",
        end_time=appointment.end_time.isoformat() if appointment.end_time else "",
        remaining_slots=remaining_slots,
        email_sent=False
    )

# ------------------------------
# Get doctor's schedule (APPOINTMENTS) - IMPROVED
# ------------------------------
@router.get("/appointments", response_model=list[DoctorAppointment])
def get_doctor_appointments(
    db: Session = Depends(get_db),
    doctor_id: int = Query(..., description="ID of the doctor"),
    status: Optional[str] = Query(None, description="Filter by status"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    include_past: bool = Query(False, description="Include past appointments")
):
    """Get all appointments for a doctor"""
    try:
        # Get appointments
        appointments = crud.get_appointments_by_doctor(db, doctor_id, status)
        
        if not appointments:
            return []
        
        # Apply date filters if provided
        filtered_appointments = []
        current_time = datetime.utcnow()
        
        for appointment in appointments:
            # Skip past appointments if not requested
            if not include_past and appointment.start_time and appointment.start_time < current_time:
                continue
                
            # Apply date filters
            include = True
            if start_date:
                try:
                    start_dt = datetime.strptime(start_date, "%Y-%m-%d")
                    if appointment.start_time and appointment.start_time.date() < start_dt.date():
                        include = False
                except ValueError:
                    pass
            
            if end_date and include:
                try:
                    end_dt = datetime.strptime(end_date, "%Y-%m-%d")
                    if appointment.start_time and appointment.start_time.date() > end_dt.date():
                        include = False
                except ValueError:
                    pass
            
            if include:
                filtered_appointments.append(appointment)
        
        # Convert to response model
        result = []
        for appointment in filtered_appointments:
            # Get request details
            request = appointment.request
            
            doctor_appointment = DoctorAppointment(
                id=appointment.id,
                patient_id=request.patient_id if request else 0,
                start_time=appointment.start_time.isoformat() if appointment.start_time else "",
                end_time=appointment.end_time.isoformat() if appointment.end_time else "",
                status=appointment.status.value if hasattr(appointment.status, 'value') else str(appointment.status),
                patient_name=f"Patient {request.patient_id}" if request else "Unknown",
                department=appointment.department.name if appointment.department else None
            )
            
            result.append(doctor_appointment)
        
        # Sort by start time
        result.sort(key=lambda x: x.start_time)
        
        return result
        
    except Exception as e:
        print(f"Error getting doctor appointments: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error retrieving appointments: {str(e)}"
        )

# ------------------------------
# Mark appointment as COMPLETED
# ------------------------------
@router.post("/appointments/{appointment_id}/complete")
def complete_appointment(
    appointment_id: int,
    doctor_id: int = Query(..., description="ID of the doctor"),
    db: Session = Depends(get_db)
):
    """Mark an appointment as completed"""
    # Get appointment
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.doctor_id == doctor_id,
        models.Appointment.status.in_([models.PreregStatus.SCHEDULED, models.PreregStatus.ACCEPTED])
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found or cannot be marked as completed")
    
    # Update status to completed
    appointment.status = models.PreregStatus.COMPLETED
    db.commit()
    
    # Also update the associated request
    if appointment.request:
        appointment.request.status = models.PreregStatus.COMPLETED
        db.commit()
    
    return {
        "message": "Appointment marked as completed",
        "appointment_id": appointment_id,
        "new_status": "completed"
    }

# ------------------------------
# Cancel an appointment (DOCTOR SIDE)
# ------------------------------
@router.post("/appointments/{appointment_id}/cancel")
def cancel_appointment(
    appointment_id: int,
    doctor_id: int = Query(..., description="ID of the doctor"),
    reason: Optional[str] = Query(None, description="Reason for cancellation"),
    db: Session = Depends(get_db)
):
    """Cancel an appointment"""
    appointment = crud.cancel_appointment_by_doctor_v2(db, appointment_id, doctor_id, reason)
    if not appointment:
        raise HTTPException(status_code=400, detail="Cannot cancel appointment")
    
    return {
        "message": "Appointment cancelled successfully",
        "appointment_id": appointment_id,
        "reason": reason or "Cancelled by doctor",
        "freed_slot": True
    }

# ------------------------------
# Get appointment statistics for doctor
# ------------------------------
@router.get("/appointments/statistics")
def get_appointment_statistics(
    doctor_id: int = Query(..., description="ID of the doctor"),
    db: Session = Depends(get_db)
):
    """Get appointment statistics for a doctor"""
    try:
        # Get all appointments for this doctor
        appointments = db.query(models.Appointment).filter(
            models.Appointment.doctor_id == doctor_id
        ).all()
        
        # Calculate statistics
        total = len(appointments)
        
        status_counts = {
            "pending": 0,
            "accepted": 0,
            "scheduled": 0,
            "completed": 0,
            "cancelled": 0,
            "declined": 0
        }
        
        for appointment in appointments:
            status = appointment.status.value if hasattr(appointment.status, 'value') else str(appointment.status)
            if status in status_counts:
                status_counts[status] += 1
        
        # Get today's date safely
        today = date.today()
        
        # Today's appointments (using try-except for database errors)
        today_appointments = 0
        try:
            today_appointments = db.query(models.Appointment).filter(
                models.Appointment.doctor_id == doctor_id,
                func.date(models.Appointment.start_time) == today
            ).count()
        except Exception as db_error:
            print(f"Database error counting today's appointments: {db_error}")
            # Fallback: check manually
            for appointment in appointments:
                if appointment.start_time and appointment.start_time.date() == today:
                    today_appointments += 1
        
        # Calculate active appointments (scheduled + accepted)
        active_appointments = status_counts["scheduled"] + status_counts["accepted"]
        
        # Upcoming appointments (next 7 days)
        week_later = today + timedelta(days=7)
        upcoming_appointments = 0
        try:
            upcoming_appointments = db.query(models.Appointment).filter(
                models.Appointment.doctor_id == doctor_id,
                models.Appointment.start_time >= datetime.combine(today, datetime.min.time()),
                models.Appointment.start_time <= datetime.combine(week_later, datetime.max.time()),
                models.Appointment.status.in_([models.PreregStatus.SCHEDULED, models.PreregStatus.ACCEPTED])
            ).count()
        except Exception as db_error:
            print(f"Database error counting upcoming appointments: {db_error}")
        
        return {
            "total_appointments": total,
            "status_counts": status_counts,
            "today_appointments": today_appointments,
            "upcoming_appointments": upcoming_appointments,
            "active_appointments": active_appointments,
            "completion_rate": round((status_counts["completed"] / total * 100), 2) if total > 0 else 0,
            "doctor_id": doctor_id
        }
        
    except Exception as e:
        print(f"Error getting appointment statistics: {e}")
        # Return basic statistics
        appointments = db.query(models.Appointment).filter(
            models.Appointment.doctor_id == doctor_id
        ).all()
        
        total = len(appointments)
        status_counts = {}
        for appointment in appointments:
            status = appointment.status.value if hasattr(appointment.status, 'value') else str(appointment.status)
            status_counts[status] = status_counts.get(status, 0) + 1
        
        return {
            "total_appointments": total,
            "status_counts": status_counts,
            "doctor_id": doctor_id,
            "error": "Partial data due to calculation error"
        }

# ------------------------------
# Get appointment details with full info - FIXED VERSION
# ------------------------------
@router.get("/appointments/{appointment_id}/details")
def get_appointment_details_full(
    appointment_id: int,
    doctor_id: int = Query(..., description="ID of the doctor"),
    db: Session = Depends(get_db)
):
    """Get full details of an appointment"""
    try:
        # Get appointment with all relationships
        appointment = db.query(models.Appointment).options(
            joinedload(models.Appointment.request),
            joinedload(models.Appointment.doctor),
            joinedload(models.Appointment.department),
            joinedload(models.Appointment.slot)
        ).filter(
            models.Appointment.id == appointment_id,
            models.Appointment.doctor_id == doctor_id
        ).first()
        
        if not appointment:
            raise HTTPException(status_code=404, detail="Appointment not found")
        
        # Get request details
        request = appointment.request
        
        # Prepare slot info safely
        slot_info = None
        if appointment.slot and appointment.slot.time_slots:
            try:
                slot_index = max(0, appointment.slot.reserved_count - 1)
                if slot_index < len(appointment.slot.time_slots):
                    slot_info = {
                        "date": appointment.slot.slot_date.isoformat() if appointment.slot.slot_date else None,
                        "time_slot": appointment.slot.time_slots[slot_index]
                    }
            except (IndexError, TypeError) as e:
                print(f"Error getting slot info: {e}")
                slot_info = None
        
        return {
            "appointment_id": appointment.id,
            "patient_id": request.patient_id if request else None,
            "patient_name": f"Patient {request.patient_id}" if request else "Unknown",
            "symptoms": request.symptoms if request else None,
            "start_time": appointment.start_time.isoformat() if appointment.start_time else None,
            "end_time": appointment.end_time.isoformat() if appointment.end_time else None,
            "status": appointment.status.value if hasattr(appointment.status, 'value') else str(appointment.status),
            "department": appointment.department.name if appointment.department else None,
            "department_id": appointment.department_id,
            "preferred_date": request.preferred_date.isoformat() if request and request.preferred_date else None,
            "created_at": appointment.created_at.isoformat() if appointment.created_at else None,
            "slot_info": slot_info,
            "doctor_name": appointment.doctor.name if appointment.doctor else None,
            "doctor_id": appointment.doctor_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting appointment details: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Error retrieving appointment details: {str(e)}"
        )

# ------------------------------
# Simple appointment details endpoint (alternative)
# ------------------------------
@router.get("/appointments/{appointment_id}")
def get_appointment_simple(
    appointment_id: int,
    doctor_id: int = Query(..., description="ID of the doctor"),
    db: Session = Depends(get_db)
):
    """Get basic appointment details"""
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id,
        models.Appointment.doctor_id == doctor_id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Get request details
    request = crud.get_prereg_request_by_id(db, appointment.request_id) if appointment.request_id else None
    
    return {
        "appointment_id": appointment.id,
        "patient_id": request.patient_id if request else None,
        "symptoms": request.symptoms if request else None,
        "start_time": appointment.start_time.isoformat() if appointment.start_time else None,
        "end_time": appointment.end_time.isoformat() if appointment.end_time else None,
        "status": appointment.status.value if hasattr(appointment.status, 'value') else str(appointment.status),
        "department": request.department if request else None,
        "created_at": appointment.created_at.isoformat() if appointment.created_at else None
    }

# ------------------------------
# Decline a prereg request
# ------------------------------
@router.post("/prereg/requests/{request_id}/decline", response_model=PreregRequestResponse)
def decline_request(
    request_id: int,
    doctor_id: int = Query(..., description="ID of the doctor"),
    reason: Optional[str] = Query(None, description="Reason for declining"),
    db: Session = Depends(get_db)
):
    req = crud.decline_request(db, request_id, doctor_id, reason)
    if not req:
        raise HTTPException(status_code=400, detail="Cannot decline request")
    return req

# ------------------------------
# Delete a prereg request
# ------------------------------
@router.delete("/prereg/requests/{request_id}")
def delete_request(
    request_id: int,
    doctor_id: int = Query(..., description="ID of the doctor"),
    db: Session = Depends(get_db)
):
    success = crud.delete_request_by_doctor(db, request_id, doctor_id)
    if not success:
        raise HTTPException(status_code=404, detail="Request not found")
    return {"message": "Request deleted successfully"}