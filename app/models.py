from sqlalchemy import Column, Integer, String, ForeignKey, Date, Numeric, TIMESTAMP, Enum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

# ------------------------
# ENUMS
# ------------------------
class PreregStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    DECLINED = "declined"

# ------------------------
# DEPARTMENT
# ------------------------
class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    keyword_mappings = Column(JSONB, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    doctors = relationship("Doctor", back_populates="department")
    prereg_requests = relationship("PreregistrationRequest", back_populates="department")
    appointments = relationship("Appointment", back_populates="department")

# ------------------------
# DOCTOR
# ------------------------
class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    max_slots_per_day = Column(Integer, default=10)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    department = relationship("Department", back_populates="doctors")
    availabilities = relationship("DoctorAvailability", back_populates="doctor")
    appointments = relationship("Appointment", back_populates="doctor")
    accepted_requests = relationship(
        "PreregistrationRequest",
        back_populates="accepted_by_doctor",
        foreign_keys="[PreregistrationRequest.accepted_by_doctor_id]"
    )

# ------------------------
# DOCTOR AVAILABILITY
# ------------------------
class DoctorAvailability(Base):
    __tablename__ = "doctor_availability"

    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    slot_date = Column(Date, nullable=False, index=True)
    time_slots = Column(JSONB, nullable=False)
    reserved_count = Column(Integer, default=0)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    doctor = relationship("Doctor", back_populates="availabilities")
    appointments = relationship("Appointment", back_populates="slot")

# ------------------------
# PREREGISTRATION REQUEST
# ------------------------
class PreregistrationRequest(Base):
    __tablename__ = "preregistration_requests"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, nullable=False, index=True)
    symptoms = Column(String, nullable=False)
    preferred_date = Column(Date, nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    department_confidence = Column(Numeric(3, 2))
    status = Column(
        Enum(PreregStatus, name="prereg_status_enum"),
        default=PreregStatus.PENDING,
        nullable=False
    )
    accepted_by_doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=True)
    decline_reason = Column(String, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    appointment = relationship(
        "Appointment",
        back_populates="request",
        uselist=False,
        foreign_keys="[Appointment.request_id]"
    )
    department = relationship("Department", back_populates="prereg_requests")
    accepted_by_doctor = relationship(
        "Doctor",
        back_populates="accepted_requests",
        foreign_keys=[accepted_by_doctor_id]
    )

# ------------------------
# APPOINTMENT
# ------------------------# In models.py, make sure Appointment has:
class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("preregistration_requests.id"), unique=True, nullable=False)
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    department_id = Column(Integer, ForeignKey("departments.id"))
    reserved_slot_id = Column(Integer, ForeignKey("doctor_availability.id"))
    start_time = Column(TIMESTAMP(timezone=True), nullable=False)
    end_time = Column(TIMESTAMP(timezone=True), nullable=False)
    status = Column(Enum(PreregStatus, name="prereg_status_enum"), default=PreregStatus.SCHEDULED, nullable=False)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    
    # Relationships
    request = relationship(
        "PreregistrationRequest",
        back_populates="appointment",
        foreign_keys=[request_id],
        uselist=False
    )
    doctor = relationship("Doctor", back_populates="appointments")
    slot = relationship("DoctorAvailability", back_populates="appointments", foreign_keys=[reserved_slot_id])
    department = relationship("Department", back_populates="appointments")