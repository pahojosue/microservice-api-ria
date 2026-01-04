from sqlalchemy import (
    Column, Integer, String, Text, Date, Time,
    Boolean, ForeignKey, TIMESTAMP
)
from sqlalchemy.sql import func
from app.database import Base


class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())


class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    specialty = Column(String(100), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP, server_default=func.now())


class DoctorAvailability(Base):
    __tablename__ = "doctor_availability"

    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"))
    day_of_week = Column(String(10), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)


class PreregistrationRequest(Base):
    __tablename__ = "preregistration_requests"

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    symptoms = Column(Text, nullable=False)
    desired_date = Column(Date, nullable=False)
    status = Column(String(20), default="pending", nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True)
    preregistration_id = Column(
        Integer, ForeignKey("preregistration_requests.id", ondelete="CASCADE"),
        unique=True
    )
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)
    status = Column(String(20), default="scheduled")
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())
 