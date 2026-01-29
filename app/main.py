from fastapi import FastAPI
from app.database import Base, engine
from app.api import patient_routes
from pydantic import BaseModel


# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Patient Service",
    description="Microservice API for managing patient profiles. Handles CRUD operations for patient data including personal information, emergency contacts, and insurance details.",
    version="1.0.0"
)


class HealthResponse(BaseModel):
    """Response model for health check."""
    status: str
    service: str


# Include routers
app.include_router(patient_routes.router)


@app.get("/health", response_model=HealthResponse, tags=["health"])
def health_check():
    """
    Health check endpoint to verify the service is running.
    """
    return HealthResponse(status="healthy", service="Patient Service")


@app.get("/", tags=["root"])
def root():
    """
    Root endpoint providing API information.
    """
    return {
        "service": "Patient Service",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }  