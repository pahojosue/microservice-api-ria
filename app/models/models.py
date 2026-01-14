from sqlalchemy import Column, Integer, String, Date, Text, Enum, TIMESTAMP
from sqlalchemy.sql import func
from app.database import Base

class Patient(Base):
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True, nullable=False)

    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    gender = Column(Enum("Male", "Female", "Other"), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    age = Column(Integer, nullable=False),

    phone = Column(String(20))
    address = Column(Text)

    emergency_contact_name = Column(String(150))
    emergency_contact_phone = Column(String(20))
    

    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(
        TIMESTAMP,
        server_default=func.now(),
        onupdate=func.now()

    )
