from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.crud import patient as crud_patient
from app.schemas.Schema import PatientCreate, PatientUpdate, PatientResponse
from pydantic import BaseModel


router = APIRouter(prefix="/patients", tags=["patients"])


class PaginatedResponse(BaseModel):
    """Response model for paginated patient lists."""
    items: List[PatientResponse]
    total: int
    skip: int
    limit: int


@router.post("/", response_model=PatientResponse, status_code=201)
def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new patient profile.
    
    - **user_id**: Unique user identifier (required)
    - **first_name**: Patient's first name (required)
    - **last_name**: Patient's last name (required)
    - **gender**: Patient's gender - "Male" or "Female" (required)
    - **date_of_birth**: Patient's date of birth (required)
    - **phone**: Contact phone number (optional)
    - **address**: Patient's address (optional)
    - **emergency_contact_name**: Emergency contact name (optional)
    - **emergency_contact_phone**: Emergency contact phone (optional)
    - **insurance_company_phone**: Insurance company phone (optional)
    - **patient_status**: Patient status (optional)
    """
    try:
        return crud_patient.create_patient(db=db, patient=patient)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{user_id}", response_model=PatientResponse)
def get_patient(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get a patient profile by user_id.
    
    - **user_id**: The user ID of the patient to retrieve
    """
    patient = crud_patient.get_patient_by_user_id(db=db, user_id=user_id)
    if not patient:
        raise HTTPException(
            status_code=404,
            detail=f"Patient profile with user_id {user_id} not found"
        )
    return patient


@router.put("/{user_id}", response_model=PatientResponse)
def update_patient(
    user_id: int,
    patient_update: PatientUpdate,
    db: Session = Depends(get_db)
):
    """
    Update an existing patient profile.
    
    - **user_id**: The user ID of the patient to update
    - All other fields are optional and will only update if provided
    """
    try:
        return crud_patient.update_patient(db=db, user_id=user_id, patient_update=patient_update)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.delete("/{user_id}", status_code=200)
def delete_patient(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete a patient profile by user_id.
    
    - **user_id**: The user ID of the patient to delete
    """
    try:
        crud_patient.delete_patient(db=db, user_id=user_id)
        return {"detail": "Patient profile deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/", response_model=PaginatedResponse)
def list_patients(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(10, ge=1, le=100, description="Maximum number of records to return"),
    status: Optional[str] = Query(None, description="Filter by status (Active/Inactive)"),
    search: Optional[str] = Query(None, description="Search term for first_name or last_name"),
    db: Session = Depends(get_db)
):
    """
    Get a paginated list of patients with optional filtering.
    
    - **skip**: Number of records to skip (for pagination)
    - **limit**: Maximum number of records to return (1-100)
    - **status**: Optional filter by status (Active/Inactive)
    - **search**: Optional search term to filter by first_name or last_name
    """
    patients, total = crud_patient.get_patients(
        db=db,
        skip=skip,
        limit=limit,
        status=status,
        search=search
    )
    return PaginatedResponse(
        items=patients,
        total=total,
        skip=skip,
        limit=limit
    )
