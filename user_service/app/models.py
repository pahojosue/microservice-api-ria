from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(250), unique=True, index=True)
    password = Column(String(200))
    role = Column(String(200), default="patient")  # NEW

