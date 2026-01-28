from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db
from ..schemas import CreateDepartment, DepartmentResponse

router = APIRouter()


@router.post("/prereg/departments", response_model=DepartmentResponse, status_code=201)
def create_department(dept: CreateDepartment, db: Session = Depends(get_db)):
    return crud.create_department(db, dept)


@router.post("/prereg/doctors", status_code=201)
def create_doctor(doctor: schemas.CreateDoctor, db: Session = Depends(get_db)):
    return crud.create_doctor(db, doctor)
