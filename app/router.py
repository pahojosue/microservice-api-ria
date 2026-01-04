from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api", tags=["PreRegistration"])

#  -------- Department Management --------
@router.post("/departments", response_model=schemas.DepartmentResponse)
def create_department(
    data: schemas.DepartmentCreate,
    db: Session = Depends(get_db)
):
    return crud.create_department(db, data)

@router.delete("/departments/{department_id}")
def delete_department(
    department_id: int,
    db: Session = Depends(get_db)
):
    return crud.delete_department(db, department_id)
@router.get("/departments", response_model=list[schemas.DepartmentResponse])
def list_departments(db: Session = Depends(get_db)):
    return crud.get_all_departments(db)

# -------- Doctor Management --------
@router.post("/departments/doctors", response_model=schemas.DoctorResponse)
def create_doctor(
    data: schemas.DoctorCreate,
    db: Session = Depends(get_db)
):
    return crud.create_doctor(db, data)  

@router.get("/departments/{department_id}/doctors", response_model=list[schemas.DoctorResponse])
def get_available_doctors(
    department_id: int,
    db: Session = Depends(get_db)
):
    doctors = crud.get_available_doctors_by_department(db, department_id)
    return doctors

@router.put("/departments/{doctor_id}/availability")
def update_doctor_availability(
    doctor_id: int,
    data: schemas.DoctorAvailabilityUpdate,  
    db: Session = Depends(get_db)
):
    return crud.update_doctor_availability(db, doctor_id, data.is_available)
@router.delete("/departments/doctors/{doctor_id}")
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db)
):
    return crud.delete_doctor(db, doctor_id)



#  -------- Preregistration Management --------
@router.post("/preregistrations", response_model=schemas.PreregistrationResponse)
def submit_preregistration(
    data: schemas.PreregistrationCreate,
    db: Session = Depends(get_db)
):
    return crud.create_preregistration(db, data)


@router.get("/preregistrations", response_model=list[schemas.PreregistrationResponse])
def list_preregistrations(
    status: str | None = None,
    db: Session = Depends(get_db)
):
    return crud.get_preregistrations(db, status)


@router.put("/preregistrations/{prereg_id}/status")
def update_preregistration_status(
    prereg_id: int,
    data: schemas.PreregistrationStatusUpdate,
    db: Session = Depends(get_db)
):
    prereg = crud.update_preregistration_status(db, prereg_id, data.status)
    if not prereg:
        raise HTTPException(status_code=404, detail="Preregistration not found")
    return prereg

@router.delete("/preregistrations/{preregistration_id}")
def delete_declined_preregistration(
    preregistration_id: int,
    db: Session = Depends(get_db)
):
    return crud.delete_declined_preregistration(db, preregistration_id)



# -------- Appointment Management --------
@router.post("/appointments", response_model=schemas.AppointmentResponse)
def schedule_appointment(
    data: schemas.AppointmentCreate,
    db: Session = Depends(get_db)
):
    return crud.create_appointment(db, data)
@router.put("/appointments/{appointment_id}/status")
def update_appointment_status(    
    appointment_id: int,    
    data: schemas.AppointmentStatusUpdate,
    db: Session = Depends(get_db)
):
    appointment = crud.update_appointment_status(db, appointment_id, data.status)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.delete("/appointments/{appointment_id}")
def delete_completed_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):
    return crud.delete_completed_appointment(db, appointment_id)

@router.get("/appointments", response_model=list[schemas.AppointmentResponse])
def list_appointments(db: Session = Depends(get_db)):
    return crud.get_all_appointments(db)
