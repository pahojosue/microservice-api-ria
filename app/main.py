from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import Base, engine, get_db
from app.models import Patient
from app.schemas.Schema import PatientCreate, PatientUpdate, PatientResponse


Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Patient Service",
    description="Handles patient profiles",
    version="1.0.0"
)
@app.post("/patients/", response_model=PatientResponse)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db)
):
    existing = db.query(Patient).filter(
        Patient.user_id == patient.user_id
    ).first()

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Patient profile already exists"
        )

    new_patient = Patient(**patient.dict())
    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient
@app.get("/patients/{user_id}", response_model=PatientResponse)
def get_patient(
    user_id: int,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(
        Patient.user_id == user_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    return patient

@app.put("/patients/{user_id}", response_model=PatientResponse)
def update_patient(
    user_id: int,
    patient: PatientUpdate,
    db: Session = Depends(get_db)
):
    existing = db.query(Patient).filter(
        Patient.user_id == user_id
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    for key, value in patient.dict(exclude_unset=True).items():
        setattr(existing, key, value)

    db.commit()
    db.refresh(existing)

    return existing
@app.get("/patients/", response_model=List[PatientResponse])
def list_patients(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    patients = db.query(Patient).offset(skip).limit(limit).all()
    return patients

@app.delete("/patients/{user_id}", response_model=dict)
def delete_patient(
    user_id: int,
    db: Session = Depends(get_db)
):
    existing = db.query(Patient).filter(
        Patient.user_id == user_id
    ).first()

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Patient profile not found"
        )

    db.delete(existing)
    db.commit()

    return {"detail": "Patient profile deleted successfully"}  