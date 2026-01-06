from pydantic import BaseModel
from datetime import date
from typing import Optional


class PatientBase(BaseModel):
    first_name: str
    last_name: str
    gender: str
    date_of_birth: date
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None


class PatientCreate(PatientBase):
    user_id: int


class PatientUpdate(PatientBase):
    pass


class PatientResponse(PatientBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
