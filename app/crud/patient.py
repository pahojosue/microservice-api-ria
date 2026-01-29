from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from typing import List, Optional
from app.models.models import Patient
from app.schemas.Schema import PatientCreate, PatientUpdate


def create_patient(db: Session, patient: PatientCreate) -> Patient:
    """
    Create a new patient profile.
    
    Args:
        db: Database session
        patient: Patient data to create
        
    Returns:
        Created patient object
        
    Raises:
        ValueError: If patient with user_id already exists
    """
    # Check if patient with user_id already exists
    existing = db.query(Patient).filter(Patient.user_id == patient.user_id).first()
    if existing:
        raise ValueError(f"Patient profile with user_id {patient.user_id} already exists")
    
    try:
        new_patient = Patient(**patient.dict())
        db.add(new_patient)
        db.commit()
        db.refresh(new_patient)
        return new_patient
    except IntegrityError as e:
        db.rollback()
        raise ValueError(f"Database integrity error: {str(e)}")


def get_patient_by_user_id(db: Session, user_id: int) -> Optional[Patient]:
    """
    Get a patient by user_id.
    
    Args:
        db: Database session
        user_id: User ID to search for
        
    Returns:
        Patient object if found, None otherwise
    """
    return db.query(Patient).filter(Patient.user_id == user_id).first()


def get_patient_by_id(db: Session, patient_id: int) -> Optional[Patient]:
    """
    Get a patient by ID.
    
    Args:
        db: Database session
        patient_id: Patient ID to search for
        
    Returns:
        Patient object if found, None otherwise
    """
    return db.query(Patient).filter(Patient.id == patient_id).first()


def get_patients(
    db: Session,
    skip: int = 0,
    limit: int = 10,
    status: Optional[str] = None,
    search: Optional[str] = None
) -> tuple[List[Patient], int]:
    """
    Get a list of patients with optional filtering and pagination.
    
    Args:
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        status: Filter by status (Active/Inactive)
        search: Search term for first_name or last_name
        
    Returns:
        Tuple of (list of patients, total count)
    """
    query = db.query(Patient)
    
    # Apply status filter
    if status:
        query = query.filter(Patient.status == status)
    
    # Apply search filter
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            (Patient.first_name.like(search_term)) |
            (Patient.last_name.like(search_term))
        )
    
    # Get total count before pagination
    total = query.count()
    
    # Apply pagination
    patients = query.offset(skip).limit(limit).all()
    
    return patients, total


def update_patient(db: Session, user_id: int, patient_update: PatientUpdate) -> Patient:
    """
    Update an existing patient profile.
    
    Args:
        db: Database session
        user_id: User ID of patient to update
        patient_update: Patient data to update
        
    Returns:
        Updated patient object
        
    Raises:
        ValueError: If patient not found
    """
    existing = db.query(Patient).filter(Patient.user_id == user_id).first()
    if not existing:
        raise ValueError(f"Patient profile with user_id {user_id} not found")
    
    try:
        # Update only provided fields
        update_data = patient_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(existing, key, value)
        
        db.commit()
        db.refresh(existing)
        return existing
    except IntegrityError as e:
        db.rollback()
        raise ValueError(f"Database integrity error: {str(e)}")


def delete_patient(db: Session, user_id: int) -> bool:
    """
    Delete a patient profile.
    
    Args:
        db: Database session
        user_id: User ID of patient to delete
        
    Returns:
        True if deleted successfully
        
    Raises:
        ValueError: If patient not found
    """
    existing = db.query(Patient).filter(Patient.user_id == user_id).first()
    if not existing:
        raise ValueError(f"Patient profile with user_id {user_id} not found")
    
    try:
        db.delete(existing)
        db.commit()
        return True
    except Exception as e:
        db.rollback()
        raise ValueError(f"Error deleting patient: {str(e)}")
