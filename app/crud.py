from sqlalchemy.orm import Session
from fastapi import HTTPException
from app import models, schemas

# -------- Preregistration Management --------
def create_preregistration(db: Session, data: schemas.PreregistrationCreate):
    department = db.query(models.Department).filter(
        models.Department.id == data.department_id
    ).first()

    if not department:
        raise HTTPException(status_code=404, detail="Department not found")

    prereg = models.PreregistrationRequest(
        patient_id=data.patient_id,
        department_id=data.department_id,
        symptoms=data.symptoms,
        desired_date=data.desired_date,
        status="pending"
    )

    db.add(prereg)
    db.commit()
    db.refresh(prereg)
    return prereg


def get_preregistrations(db: Session, status: str | None = None):
    query = db.query(models.PreregistrationRequest)
    if status:
        query = query.filter(models.PreregistrationRequest.status == status)
    return query.all()



ALLOWED_STATUSES = {"accepted", "declined"}

def update_preregistration_status(
    db: Session,
    prereg_id: int,
    new_status: str
):
    if new_status not in ALLOWED_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Status must be 'accepted' or 'declined'"
        )

    prereg = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == prereg_id
    ).first()

    if not prereg:
        return None

    if prereg.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending preregistrations can be updated"
        )

    prereg.status = new_status
    db.commit()
    db.refresh(prereg)
    return prereg

# ------- Delete Declined Preregistration --------
def delete_declined_preregistration(db: Session, preregistration_id: int):
    prereg = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == preregistration_id,
        models.PreregistrationRequest.status == "declined"
    ).first()

    if not prereg:
        raise HTTPException(status_code=404, detail="Declined preregistration not found")

    db.delete(prereg)
    db.commit()
    return {"detail": "Declined preregistration deleted"}


# -------- Appointment Management --------
def create_appointment(db: Session, data: schemas.AppointmentCreate):
    prereg = db.query(models.PreregistrationRequest).filter(
        models.PreregistrationRequest.id == data.preregistration_id,
        models.PreregistrationRequest.status == "accepted"
    ).first()

    if not prereg:
        raise HTTPException(
            status_code=400,
            detail="Preregistration must be accepted first"
        )

    appointment = models.Appointment(
        preregistration_id=data.preregistration_id,
        doctor_id=data.doctor_id,
        appointment_date=data.appointment_date,
        appointment_time=data.appointment_time
    )

    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment


ALLOWED_APPOINTMENT_STATUSES = {"scheduled", "cancelled", "completed"}
def update_appointment_status(
    db: Session,
    appointment_id: int,
    new_status: str
):  
    if new_status not in ALLOWED_APPOINTMENT_STATUSES:
        raise HTTPException(
            status_code=400,
            detail="Status must be 'scheduled', 'cancelled', or 'completed'"
        )

    appointment = db.query(models.Appointment).filter(
        models.Appointment.id == appointment_id
    ).first()

    if not appointment:
        return None

    appointment.status = new_status
    db.commit()
    db.refresh(appointment)
    return appointment

def get_all_appointments(db: Session):
    return db.query(models.Appointment).all()

def delete_completed_appointment(db: Session, appointment_id: int):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id, models.Appointment.status == "completed").first()

    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found or not completed")

    db.delete(appointment)
    db.commit()
    return {"detail": "Completed appointment deleted"}

# -------- Department Management --------
def create_department(db: Session, data: schemas.DepartmentCreate):
    department = models.Department(
        name=data.name,
        description=data.description
    )
    db.add(department)
    db.commit()
    db.refresh(department)
    return department

def delete_department(db: Session, department_id: int):
    department = db.query(models.Department).filter(models.Department.id == department_id).first()
    
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    
    db.delete(department)
    db.commit()
    return {"detail": "Department deleted"}


# -------- Doctor Management --------
def create_doctor(db: Session, data: schemas.DoctorCreate):
    doctor = models.Doctor(  # Ensure using the correct model name
        name=data.name,
        specialty=data.specialty,
        is_active=data.is_active,
        department_id=data.department_id
    )
    db.add(doctor)
    db.commit()
    db.refresh(doctor)
    return doctor

def get_available_doctors_by_department(db: Session, department_id: int):
    return (
        db.query(models.Doctor)
        .filter(models.Doctor.department_id == department_id, models.Doctor.is_active == True)
        .all()
    )

def update_doctor_availability(db: Session, doctor_id: int, is_available: bool):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    doctor.is_active = is_available
    db.commit()
    db.refresh(doctor)
    return doctor


def delete_doctor(db: Session, doctor_id: int):
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    db.delete(doctor)
    db.commit()
    return {"detail": "Doctor deleted"}