from fastapi import APIRouter, Depends, HTTPException, Header
from jose import JWTError
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models, schemas, auth

router = APIRouter(prefix="/users", tags=["Users"])

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# REGISTER USER
@router.post("/register", response_model=schemas.UserResponse, status_code=201)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = 
    existing = db.query(models.User).filter(models.User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = auth.hash_password(user.password)
    new_user = models.User(**user.model_dump())

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# LOGIN USER
@router.post("/login")
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user or not auth.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_access_token({"sub": db_user.email, "role": db_user.role})
    return {"access_token": token, "token_type": "bearer"}


# VALIDATE TOKEN FOR OTHER SERVICES
@router.post("/validate-token")
def validate_token(token: str):
    try:
        payload = auth.decode_access_token(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {
        "valid": True,
        "sub": payload.get("sub"),
        "role": payload.get("role"),
    }


# USER PROFILE (BASIC INFO ONLY)
@router.get("/me", response_model=schemas.UserResponse)
def read_profile(
    authorization: str = Header(..., description="Bearer access token"),
    db: Session = Depends(get_db),
):
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")

    token = authorization.split()[1]

    try:
        payload = auth.decode_access_token(token)
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    email = payload.get("sub")
    if email is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")

    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
