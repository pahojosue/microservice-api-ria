from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: str
    password: str
    role: str   # NEW

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str               # NEW

