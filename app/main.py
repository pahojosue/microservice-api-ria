from fastapi import FastAPI
from app.database import engine
from app import models
from app.router import router

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pre-Registration Service")

app.include_router(router)
