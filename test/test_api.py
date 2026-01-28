import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base

client = TestClient(app)

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # Required for SQLite threading in tests
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


def test_create_department(db_session):
    response = client.post(
        "/api/prereg/departments",
        json={
            "name": "Cardiology",
            "keyword_mappings": {"chest": 1.0, "pain": 0.9}
        }
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Cardiology"


def test_create_prereg_request(db_session):
    # First create department
    client.post(
        "/api/prereg/departments",
        json={
            "name": "Cardiology",
            "keyword_mappings": {"chest": 1.0}
        }
    )
    response = client.post(
        "/api/prereg/requests",
        json={
            "symptoms": "chest pain",
            "preferred_date": "2026-01-20"
        }
    )
    assert response.status_code == 201
    assert response.json()["status"] == "pending"  # Fixed missing quote
    assert response.json()["department"] == "Cardiology"