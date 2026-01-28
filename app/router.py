from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter(prefix="/api", tags=["PreRegistration"])

# =======================
# Department Management
# =======================

@router.post(
    "/departments",
    response_model=schemas.DepartmentResponse,
    status_code=status.HTTP_201_CREATED
)
def create_department(
    data: schemas.DepartmentCreate,
    db: Session = Depends(get_db)
):
    return crud.create_department(db, data)


@router.get(
    "/departments",
    response_model=list[schemas.DepartmentResponse],
    status_code=status.HTTP_200_OK
)
def list_departments(db: Session = Depends(get_db)):
    return crud.get_all_departments(db)


@router.put(
    "/departments/{department_id}",
    response_model=schemas.DepartmentResponse,
    status_code=status.HTTP_200_OK
)
def update_department(
    department_id: int,
    data: schemas.DepartmentCreate,
    db: Session = Depends(get_db)
):
    department = crud.update_department(db, department_id, data)
    if not department:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    return department


@router.delete(
    "/departments/{department_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_department(
    department_id: int,
    db: Session = Depends(get_db)
):
    if not crud.delete_department(db, department_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Department not found"
        )
    return None


# ==================
# Doctor Management
# ==================

@router.post(
    "/departments/doctors",
    response_model=schemas.DoctorResponse,
    status_code=status.HTTP_201_CREATED
)
def create_doctor(
    data: schemas.DoctorCreate,
    db: Session = Depends(get_db)
):
    return crud.create_doctor(db, data)


@router.get(
    "/departments/{department_id}/doctors",
    response_model=list[schemas.DoctorResponse],
    status_code=status.HTTP_200_OK
)
def get_available_doctors(
    department_id: int,
    db: Session = Depends(get_db)
):
    return crud.get_available_doctors_by_department(db, department_id)


@router.put(
    "/departments/{doctor_id}/availability",
    status_code=status.HTTP_200_OK
)
def update_doctor_availability(
    doctor_id: int,
    data: schemas.DoctorAvailabilityUpdate,
    db: Session = Depends(get_db)
):
    doctor = crud.update_doctor_availability(db, doctor_id, data.is_available)
    if not doctor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    return doctor


@router.delete(
    "/departments/doctors/{doctor_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db)
):
    if not crud.delete_doctor(db, doctor_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Doctor not found"
        )
    return None


# ==========================
# Preregistration Management
# ==========================

@router.post(
    "/preregistrations",
    response_model=schemas.PreregistrationResponse,
    status_code=status.HTTP_201_CREATED
)
def submit_preregistration(
    data: schemas.PreregistrationCreate,
    db: Session = Depends(get_db)
):
    return crud.create_preregistration(db, data)


@router.get(
    "/preregistrations",
    response_model=list[schemas.PreregistrationResponse],
    status_code=status.HTTP_200_OK
)
def list_preregistrations(
    status: str | None = None,
    db: Session = Depends(get_db)
):
    return crud.get_preregistrations(db, status)


@router.put(
    "/preregistrations/{prereg_id}/status",
    response_model=schemas.PreregistrationResponse,
    status_code=status.HTTP_200_OK
)
def update_preregistration_status(
    prereg_id: int,
    data: schemas.PreregistrationStatusUpdate,
    db: Session = Depends(get_db)
):
    prereg = crud.update_preregistration_status(
        db, prereg_id, data.status
    )

    if not prereg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preregistration not found"
        )

    return prereg


@router.delete(
    "/preregistrations/{preregistration_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_declined_preregistration(
    preregistration_id: int,
    db: Session = Depends(get_db)
):
    if not crud.delete_declined_preregistration(db, preregistration_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Preregistration not found or not declined"
        )
    return None


# ======================
# Appointment Management
# ======================

@router.post(
    "/appointments",
    response_model=schemas.AppointmentResponse,
    status_code=status.HTTP_201_CREATED
)
def schedule_appointment(
    data: schemas.AppointmentCreate,
    db: Session = Depends(get_db)
):
    return crud.create_appointment(db, data)


@router.put(
    "/appointments/{appointment_id}/status",
    response_model=schemas.AppointmentResponse,
    status_code=status.HTTP_200_OK
)
def update_appointment_status(
    appointment_id: int,
    data: schemas.AppointmentStatusUpdate,
    db: Session = Depends(get_db)
):
    appointment = crud.update_appointment_status(
        db, appointment_id, data.status
    )

    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found"
        )

    return appointment


@router.delete(
    "/appointments/{appointment_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def delete_completed_appointment(
    appointment_id: int,
    db: Session = Depends(get_db)
):
    if not crud.delete_completed_appointment(db, appointment_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found or not completed"
        )
    return None


@router.get(
    "/appointments",
    response_model=list[schemas.AppointmentResponse],
    status_code=status.HTTP_200_OK
)
def list_appointments(db: Session = Depends(get_db)):
    return crud.get_all_appointments(db)
    return db.query(models.Department).all()