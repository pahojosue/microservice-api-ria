from fastapi import FastAPI, HTTPException, Depends, status
import uvicorn
from uuid import uuid4
from pydantic import BaseModel
from typing import Annotated
import models.models
from database.database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI(debug=True)
models.models.Base.metadata.create_all(bind=engine)

class CategoryBase(BaseModel):
    name: str

class TagBase(BaseModel):
    name: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#Used for dependency injection
db_dependency = Annotated[Session, Depends(get_db)]

import api

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3000)
