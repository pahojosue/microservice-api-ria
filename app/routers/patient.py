# app/routers/patient.py
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional
from .. import crud, models, services
from ..database import get_db
from ..schemas import CreatePreregRequest, UpdatePreregRequestPatient, PreregRequestResponse
# from ..notifications import notification_service

router = APIRouter(prefix="/api/patient", tags=["Patient"])

# ------------------------------
# Create a prereg request - FIXED
# ------------------------------
@router.post("/prereg/requests", response_model=PreregRequestResponse)
def create_request(
    request: CreatePreregRequest,
    background_tasks: BackgroundTasks,
    patient_id: int = Query(..., description="ID of the patient"),
    patient_email: Optional[str] = Query(None, description="Patient email for notifications"),
    db: Session = Depends(get_db)
):
    try:
        # Detect department from symptoms
        department_id, confidence = services.detect_department(db, request.symptoms)
        print(f"DEBUG: Detected department_id={department_id}, confidence={confidence}")
    except Exception as e:
        print(f"ERROR in detect_department: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    
    if not department_id:
        raise HTTPException(status_code=400, detail="Cannot detect department from symptoms")
    
    # Create the request using the fixed CRUD function
    db_request = crud.create_prereg_request(
        db=db,
        patient_id=patient_id,
        obj_in=request,
        department_id=department_id,
        department_confidence=confidence
    )
    
    print(f"DEBUG: Created request response: department_id={db_request.department_id}")
    
    # Send confirmation email if email provided
    if patient_email and db_request:
        try:
            # Get department name
            department = crud.get_department(db, db_request.department_id)
            department_name = department.name if department else "Unknown Department"
            
            # Get doctor name if assigned
            doctor_name = "To be assigned"
            if db_request.assigned_doctor_id:
                doctor = crud.get_doctor(db, db_request.assigned_doctor_id)
                doctor_name = doctor.name if doctor else "Doctor"
            
            # Send email in background
            background_tasks.add_task(
                notification_service.send_appointment_confirmation,
                patient_email,
                f"Patient {patient_id}",
                doctor_name,
                str(request.preferred_date),
                department_name
            )
        except Exception as e:
            print(f"WARNING: Failed to send notification email: {e}")
            # Continue even if email fails
    
    return db_request

# ------------------------------
# Get all requests for a patient - FIXED
# ------------------------------
@router.get("/prereg/requests", response_model=list[PreregRequestResponse])
def get_my_requests(
    patient_id: int = Query(..., description="ID of the patient"),
    status: Optional[str] = Query(
        None, 
        description="Filter by status (pending, accepted, scheduled, completed, cancelled, declined)"
    ),
    db: Session = Depends(get_db)
):
    # Validate status
    valid_statuses = [s.value for s in models.PreregStatus]
    if status and status not in valid_statuses:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid status '{status}'. Must be one of: {', '.join(valid_statuses)}"
        )
    
    # Get requests using fixed CRUD function
    requests = crud.get_prereg_requests_by_patient(db, patient_id, status)
    
    # Debug: Check each request
    for req in requests:
        print(f"DEBUG API Response: Request {req.id}, department_id={req.department_id}")
    
    return requests

# ------------------------------
# Get single request by ID - FIXED
# ------------------------------
@router.get("/prereg/requests/{request_id}", response_model=PreregRequestResponse)
def get_request_by_id(
    request_id: int,
    patient_id: int = Query(..., description="ID of the patient"),
    db: Session = Depends(get_db)
):
    req = crud.get_prereg_request_by_id(db, request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    if req.patient_id != patient_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this request")
    
    print(f"DEBUG: Returning request {req.id} with department_id={req.department_id}")
    return req

# ------------------------------
# Update a request (patient) - FIXED
# ------------------------------
@router.patch("/prereg/requests/{request_id}", response_model=PreregRequestResponse)
def update_request(
    request_id: int,
    update: UpdatePreregRequestPatient,
    patient_id: int = Query(..., description="ID of the patient"),
    db: Session = Depends(get_db)
):
    # First verify the request belongs to the patient
    existing_req = crud.get_prereg_request_by_id(db, request_id)
    if not existing_req or existing_req.patient_id != patient_id:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Check if request can be updated
    if existing_req.status in ["declined", "cancelled"]:
        raise HTTPException(status_code=400, detail="Cannot update declined or cancelled request")
    
    # Update the request
    updated_req = crud.update_request_patient(db, request_id, update)
    if not updated_req:
        raise HTTPException(status_code=404, detail="Request not found")
    
    return updated_req

# ------------------------------
# Cancel a request - FIXED
# ------------------------------
@router.post("/prereg/requests/{request_id}/cancel", response_model=PreregRequestResponse)
def cancel_request(
    request_id: int,
    patient_id: int = Query(..., description="ID of the patient"),
    db: Session = Depends(get_db)
):
    req = crud.cancel_request(db, request_id, patient_id)
    if not req:
        raise HTTPException(status_code=400, detail="Cannot cancel request")
    
    return req

# ------------------------------
# Delete a cancelled request - FIXED
# ------------------------------
@router.delete("/prereg/requests/{request_id}")
def delete_request(
    request_id: int,
    patient_id: int = Query(..., description="ID of the patient"),
    db: Session = Depends(get_db)
):
    success = crud.delete_request_by_patient(db, request_id, patient_id)
    if not success:
        raise HTTPException(status_code=400, detail="Cannot delete request")
    
    return {"message": "Request deleted successfully"}

# app/routers/patient.py - ADD THESE ENDPOINTS

@router.get("/appointments", response_model=list[dict])
def get_patient_appointments(
    patient_id: int = Query(..., description="ID of the patient"),
    status: Optional[str] = Query(None, description="Filter by status"),
    db: Session = Depends(get_db)
):
    """Get all appointments for a patient"""
    # Get appointments using the new CRUD function
    appointments = crud.get_appointments_by_patient(db, patient_id, status)
    
    if not appointments:
        return []
    
    result = []
    for appointment in appointments:
        result.append({
            "id": appointment.id,
            "patient_id": patient_id,
            "doctor_id": appointment.doctor_id,
            "doctor_name": appointment.doctor.name if appointment.doctor else None,
            "department_name": appointment.department.name if appointment.department else None,
            "start_time": appointment.start_time.isoformat() if appointment.start_time else None,
            "end_time": appointment.end_time.isoformat() if appointment.end_time else None,
            "status": appointment.status.value if hasattr(appointment.status, 'value') else str(appointment.status),
            "symptoms": appointment.request.symptoms if appointment.request else None,
            "created_at": appointment.created_at.isoformat() if appointment.created_at else None
        })
    
    return result

@router.get("/appointments/{appointment_id}")
def get_patient_appointment_details(
    appointment_id: int,
    patient_id: int = Query(..., description="ID of the patient"),
    db: Session = Depends(get_db)
):
    """Get details of a specific appointment for a patient"""
    # Get the appointment
    appointment = crud.get_appointment_by_id(db, appointment_id)
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify this appointment belongs to the patient
    if not appointment.request or appointment.request.patient_id != patient_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get additional details
    request = appointment.request
    
    return {
        "appointment_id": appointment.id,
        "patient_id": patient_id,
        "doctor_id": appointment.doctor_id,
        "doctor_name": appointment.doctor.name if appointment.doctor else None,
        "department_name": appointment.department.name if appointment.department else None,
        "start_time": appointment.start_time.isoformat() if appointment.start_time else None,
        "end_time": appointment.end_time.isoformat() if appointment.end_time else None,
        "status": appointment.status.value if hasattr(appointment.status, 'value') else str(appointment.status),
        "symptoms": request.symptoms if request else None,
        "preferred_date": request.preferred_date.isoformat() if request else None,
        "created_at": appointment.created_at.isoformat() if appointment.created_at else None
    }

@router.post("/appointments/{appointment_id}/cancel")
def cancel_patient_appointment(
    appointment_id: int,
    patient_id: int = Query(..., description="ID of the patient"),
    reason: Optional[str] = Query(None, description="Reason for cancellation"),
    db: Session = Depends(get_db)
):
    """Cancel an appointment (patient side)"""
    # Get appointment
    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id
    ).first()
    
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # Verify it belongs to this patient
    if not appointment.request or appointment.request.patient_id != patient_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Check if appointment can be cancelled
    if appointment.status not in [models.PreregStatus.SCHEDULED, models.PreregStatus.ACCEPTED]:
        raise HTTPException(status_code=400, detail="Cannot cancel appointment with current status")
    
    # Update appointment status
    appointment.status = models.PreregStatus.CANCELLED
    db.commit()
    
    # Update the associated request
    if appointment.request:
        appointment.request.status = models.PreregStatus.CANCELLED
        appointment.request.decline_reason = reason or "Cancelled by patient"
        db.commit()
    
    # Free up the reserved slot
    if appointment.reserved_slot_id:
        availability = db.query(models.DoctorAvailability).filter(
            models.DoctorAvailability.id == appointment.reserved_slot_id
        ).first()
        
        if availability and availability.reserved_count > 0:
            availability.reserved_count -= 1
            db.commit()
    
    return {
        "message": "Appointment cancelled successfully",
        "appointment_id": appointment_id,
        "reason": reason or "Cancelled by patient"
    }