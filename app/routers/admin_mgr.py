# app/routers/admin_mgr.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models
from ..database import get_db
from ..schemas import CreateDepartment, DepartmentResponse, CreateDoctor, CreateAvailability

router = APIRouter(prefix="/api/admin", tags=["Admin Management"])

# ------------------------------
# Create a new department
# ------------------------------
@router.post("/departments", response_model=DepartmentResponse)
def create_department(
    dept: CreateDepartment,
    db: Session = Depends(get_db)
):
    try:
        db_dept = crud.create_department(db, dept)
        return DepartmentResponse(
            id=db_dept.id,
            name=db_dept.name,
            keyword_mappings=db_dept.keyword_mappings
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

# ------------------------------
# Get all departments
# ------------------------------
@router.get("/departments", response_model=List[DepartmentResponse])
def get_departments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    departments = crud.get_all_departments(db, skip=skip, limit=limit)
    return [
        DepartmentResponse(
            id=dept.id,
            name=dept.name,
            keyword_mappings=dept.keyword_mappings
        )
        for dept in departments
    ]

# ------------------------------
# Create a new doctor
# ------------------------------
@router.post("/doctors")
def create_doctor(
    doctor: CreateDoctor,
    db: Session = Depends(get_db)
):
    try:
        db_doctor = crud.create_doctor(db, doctor)
        dept = crud.get_department(db, db_doctor.department_id)
        return {
            "id": db_doctor.id,
            "name": db_doctor.name,
            "department_id": db_doctor.department_id,
            "department_name": dept.name if dept else "Unknown",
            "max_slots_per_day": db_doctor.max_slots_per_day,
            "created_at": db_doctor.created_at
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# ------------------------------
# Get all doctors
# ------------------------------
@router.get("/doctors")
def get_doctors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db)
):
    doctors = crud.get_all_doctors(db, skip=skip, limit=limit)
    response = []
    for doctor in doctors:
        dept = doctor.department
        response.append({
            "id": doctor.id,
            "name": doctor.name,
            "department_id": doctor.department_id,
            "department_name": dept.name if dept else "Unknown",
            "max_slots_per_day": doctor.max_slots_per_day,
            "created_at": doctor.created_at
        })
    return response

# ------------------------------
# Create availability
# ------------------------------
@router.post("/availability")
def create_availability(
    availability: CreateAvailability,
    db: Session = Depends(get_db)
):
    try:
        db_availability = crud.create_availability(db, availability)
        return {
            "id": db_availability.id,
            "doctor_id": db_availability.doctor_id,
            "slot_date": db_availability.slot_date,
            "time_slots": db_availability.time_slots,
            "reserved_count": db_availability.reserved_count
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))