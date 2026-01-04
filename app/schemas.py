from pydantic import BaseModel, Field
from datetime import date, time
from typing import Literal


class PreregistrationCreate(BaseModel):
    patient_id: int = Field(..., gt=0)
    department_id: int = Field(..., gt=0)
    symptoms: str
    desired_date: date


class PreregistrationResponse(BaseModel):
    id: int
    patient_id: int
    department_id: int
    symptoms: str
    desired_date: date
    status: str

    class Config:
        from_attributes = True


class PreregistrationStatusUpdate(BaseModel):
    status: Literal["accepted", "declined"]


class AppointmentCreate(BaseModel):
    preregistration_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time


class AppointmentResponse(BaseModel):
    id: int
    preregistration_id: int
    doctor_id: int
    appointment_date: date
    appointment_time: time
    status: str

    class Config:
        from_attributes = True

class AppointmentStatusUpdate(BaseModel):
    status: Literal["scheduled", "cancelled", "completed"]

class DepartmentCreate(BaseModel):
    name: str
    description: str | None = None
class DepartmentResponse(BaseModel):
    id: int
    name: str
    description: str | None = None

    class Config:
        from_attributes = True

class DoctorCreate(BaseModel):
    name: str
    specialty: str
    department_id: int
    is_active: bool
class DoctorResponse(BaseModel):
    id: int
    name: str
    specialty: str
    department_id: int
    is_active: bool

    class Config:
        from_attributes = True

class DoctorAvailabilityUpdate(BaseModel):
    is_available: bool