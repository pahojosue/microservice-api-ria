# app/schemas.py
from pydantic import BaseModel, Field
from datetime import date, datetime
from typing import Dict, Optional, List
from enum import Enum

# ========================
# Status Enum
# ========================
class PreregStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    scheduled = "scheduled"
    completed = "completed"
    cancelled = "cancelled"
    declined = "declined"

# ========================
# Patient Schemas
# ========================
class CreatePreregRequest(BaseModel):
    symptoms: str = Field(..., min_length=5, max_length=500)
    preferred_date: date

class UpdatePreregRequest(BaseModel):
    preferred_date: Optional[date] = None
    status: Optional[PreregStatus] = None

    class Config:
        use_enum_values = True
        
class UpdatePreregRequestPatient(BaseModel):
    symptoms: str = Field(..., min_length=5, max_length=500)
    preferred_date: Optional[date] = None
    # status: Optional[PreregStatus] = None

    class Config:
        use_enum_values = True

class PreregRequestResponse(BaseModel):
    id: int
    patient_id: int
    status: PreregStatus
    department: str
    department_id: int = Field(..., description="Department ID")  # ✅ Changed to required
    department_confidence: Optional[float]
    preferred_date: date
    created_at: datetime
    assigned_doctor_id: Optional[int] = None
    assigned_doctor_name: Optional[str] = None
    assigned_slot: Optional[Dict[str, str]] = None

    class Config:
        from_attributes = True

# ========================
# Doctor Schemas
# ========================
class AcceptRequest(BaseModel):
    status: PreregStatus = PreregStatus.accepted
    appointment_id: int
    start_time: str
    end_time: str
    remaining_slots: int
    email_sent: bool = True

class DeclineRequest(BaseModel):
    status: PreregStatus = PreregStatus.declined
    request_id: int
    reason: Optional[str] = None

class CancelAppointment(BaseModel):
    status: PreregStatus = PreregStatus.cancelled
    appointment_id: int
    email_sent: bool = True

class DoctorAppointment(BaseModel):
    id: int
    patient_id: int
    start_time: str
    end_time: str
    status: PreregStatus
    patient_name: Optional[str] = None
    department: Optional[str] = None
# Add to schemas.py
class UpdateAppointmentStatus(BaseModel):
    status: PreregStatus
    reason: Optional[str] = None

    class Config:
        use_enum_values = True
        
# ========================
# Department Schemas
# ========================
class CreateDepartment(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    keyword_mappings: Dict[str, float] = Field(...)

class DepartmentResponse(BaseModel):
    id: int
    name: str
    keyword_mappings: Dict[str, float]

    class Config:
        from_attributes = True

# ========================
# Doctor Schemas
# ========================
class CreateDoctor(BaseModel):
    name: str
    department_id: int
    max_slots_per_day: int = 10

class CreateAvailability(BaseModel):
    doctor_id: int
    slot_date: date
    time_slots: List[Dict[str, str]]

class AvailabilityResponse(BaseModel):
    id: int
    doctor_id: int
    slot_date: date
    time_slots: List[Dict[str, str]]

    class Config:
        from_attributes = True

# ========================
# Auto Assignment Schema
# ========================
class AutoAssignResponse(BaseModel):
    request_id: int
    patient_id: int
    department: str
    assigned_doctor_id: int
    assigned_doctor_name: str
    assigned_slot: Dict[str, str]
    status: PreregStatus = PreregStatus.pending
    message: str

# ========================
# Doctor Response Schema
# ========================
class DoctorResponse(BaseModel):
    id: int
    name: str
    department_id: int
    max_slots_per_day: int
    created_at: datetime

    class Config:
        from_attributes = True

# ========================
# Doctor Availability Schema
# ========================
class DoctorAvailabilityResponse(BaseModel):
    id: int
    doctor_id: int
    slot_date: date
    time_slots: List[Dict[str, str]]
    reserved_count: int
    created_at: datetime

    class Config:
        from_attributes = True