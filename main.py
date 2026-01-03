from fastapi import FastAPI, HTTPException, Depends, status
import uvicorn
from uuid import uuid4
from pydantic import BaseModel
from typing import Annotated
import models.models
from database.database import engine, SessionLocal
from sqlalchemy.orm import Session

app = FastAPI()
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

@app.post("/category", status_code=status.HTTP_201_CREATED)
async def create_category(category: CategoryBase, db: db_dependency):
    db_category = models.models.Categories(**category.dict())
    db.add(db_category)
    db.commit()

@app.get("/category/{category_id}", status_code=status.HTTP_200_OK)
async def read_category(category_id: str, db: db_dependency):
    category = db.query(models.models.Categories).filter(models.models.Categories.id == category_id).first()
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category

@app.get("/category", status_code=status.HTTP_200_OK)
async def read_all_category(db: db_dependency):
    categories = db.query(models.models.Categories).all()
    if categories is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return categories

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=3000)
