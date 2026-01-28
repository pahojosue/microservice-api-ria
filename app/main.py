# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from .routers import patient, doctor, admin_mgr

app = FastAPI(
    title="Hospital Pre-registration System",
    version="2.0.0",
    description="API for hospital pre-registration with department detection",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(patient.router)
app.include_router(doctor.router)
app.include_router(admin_mgr.router)

@app.get("/")
def root():
    return {
        "message": "Hospital Pre-registration System API",
        "version": "2.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "endpoints": {
            "patient": "/api/patient",
            "doctor": "/api/doctor",
            "admin": "/api/admin",
            "docs": "/docs"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}