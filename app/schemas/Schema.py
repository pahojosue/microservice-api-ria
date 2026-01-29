from pydantic import BaseModel, field_validator, computed_field
from datetime import date, datetime
from typing import Optional
import re


class PatientBase(BaseModel):
    first_name: str
    last_name: str
    gender: str
    date_of_birth: date
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    insurance_company_phone: Optional[str] = None
    patient_status: Optional[str] = None

    @field_validator('gender')
    @classmethod
    def validate_gender(cls, v: str) -> str:
        allowed = ["Male", "Female"]
        if v not in allowed:
            raise ValueError(f"Gender must be one of {allowed}")
        return v

    @field_validator('phone', 'emergency_contact_phone', 'insurance_company_phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        # Remove common phone number formatting characters
        cleaned = re.sub(r'[\s\-\(\)]', '', v)
        # Check if it contains only digits and optional + at start
        if not re.match(r'^\+?\d{10,15}$', cleaned):
            raise ValueError("Phone number must be 10-15 digits, optionally starting with +")
        return v

    @field_validator('date_of_birth')
    @classmethod
    def validate_date_of_birth(cls, v: date) -> date:
        if v > date.today():
            raise ValueError("Date of birth cannot be in the future")
        return v


class PatientCreate(PatientBase):
    user_id: int


class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    insurance_company_phone: Optional[str] = None
    patient_status: Optional[str] = None
    status: Optional[str] = None

    @field_validator('gender')
    @classmethod
    def validate_gender(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        allowed = ["Male", "Female"]
        if v not in allowed:
            raise ValueError(f"Gender must be one of {allowed}")
        return v

    @field_validator('status')
    @classmethod
    def validate_status(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        allowed = ["Active", "Inactive"]
        if v not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return v

    @field_validator('phone', 'emergency_contact_phone', 'insurance_company_phone')
    @classmethod
    def validate_phone(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = re.sub(r'[\s\-\(\)]', '', v)
        if not re.match(r'^\+?\d{10,15}$', cleaned):
            raise ValueError("Phone number must be 10-15 digits, optionally starting with +")
        return v

    @field_validator('date_of_birth')
    @classmethod
    def validate_date_of_birth(cls, v: Optional[date]) -> Optional[date]:
        if v is None:
            return v
        if v > date.today():
            raise ValueError("Date of birth cannot be in the future")
        return v


class PatientResponse(PatientBase):
    id: int
    user_id: int
    status: str
    created_at: datetime
    updated_at: datetime

    @computed_field
    @property
    def age(self) -> int:
        """Calculate age from date of birth."""
        today = date.today()
        age = today.year - self.date_of_birth.year
        if today.month < self.date_of_birth.month or (today.month == self.date_of_birth.month and today.day < self.date_of_birth.day):
            age -= 1
        return age

    class Config:
        from_attributes = True
