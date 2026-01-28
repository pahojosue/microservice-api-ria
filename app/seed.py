# seed.py (updated version)
from datetime import date, timedelta, datetime
from app.database import SessionLocal
from app import models

db = SessionLocal()

print("🌱 Starting database seeding...")

    # ======================================================
    # Clear existing data (optional - for fresh start)
    # ======================================================
    # Uncomment if you want to clear existing data first
    # print("🗑️  Clearing existing data...")
    # db.query(models.Appointment).delete()
# db.query(models.PreregistrationRequest).delete()
#     # db.query(models.DoctorAvailability).delete()
#     # db.query(models.Doctor).delete()
# db.query(models.Department).delete()
db.commit()
        
        # ======================================================
        # Departments
        # ======================================================
departments = {
    "Cardiology": {
        "heart": 1.0, "cardio": 0.9, "chest": 0.8, "pain": 0.7,
        "pressure": 0.6, "attack": 0.9, "arrhythmia": 1.0,
        "palpitation": 0.9, "blood": 0.5, "hypertension": 0.9
        },
    "Neurology": {
        "brain": 1.0, "neuro": 0.9, "head": 0.8, "ache": 0.7,
        "migraine": 0.9, "seizure": 1.0, "stroke": 1.0,
        "memory": 0.8, "dizziness": 0.7, "vertigo": 0.9
        },
    "Pediatrics": {
        "child": 1.0, "baby": 0.9, "pediatric": 0.8, "infant": 0.9,
        "fever": 0.7, "vaccine": 0.8, "growth": 0.6,
        "development": 0.6, "newborn": 1.0, "toddler": 0.9
        },
    "Orthopedics": {
        "bone": 1.0, "joint": 0.9, "fracture": 1.0, "sprain": 0.9,
        "arthritis": 1.0, "back": 0.8, "knee": 0.9, "shoulder": 0.9
        },
    "Dermatology": {
        "skin": 1.0, "rash": 0.9, "acne": 0.8, "eczema": 0.9,
        "psoriasis": 1.0, "itching": 0.7, "allergy": 0.6,
        "derma": 0.8, "mole": 0.7, "lesion": 0.8, "bruises": 0.6, "burn": 0.7
        }
}

dept_objects = {}

for name, keywords in departments.items():
    dept = db.query(models.Department).filter_by(name=name).first()
    if not dept:
        dept = models.Department(name=name, keyword_mappings=keywords)
        db.add(dept)
        print(f"✅ Department added: {name}")
    else:
        print(f"📋 Department exists: {name}")
    dept_objects[name] = dept

db.commit()

# ======================================================
# Doctors
# ======================================================
doctors = [
    ("Dr. Sarah Johnson", "Cardiology", 10),
    ("Dr. Michael Chen", "Cardiology", 8),
    ("Dr. Robert Kim", "Neurology", 10),
    ("Dr. Maria Rodriguez", "Neurology", 8),
    ("Dr. Emily Davis", "Pediatrics", 12),
    ("Dr. David Brown", "Pediatrics", 10),
    ("Dr. Thomas Anderson", "Orthopedics", 8),
    ("Dr. Jennifer Lee", "Orthopedics", 8),
    ("Dr. Kevin Patel", "Dermatology", 10),
    ("Dr. Amanda White", "Dermatology", 8),
]

doctor_objects = {}

for doctor_name, dept_name, max_slots in doctors:
    doc = db.query(models.Doctor).filter_by(name=doctor_name).first()
    if not doc:
        doc = models.Doctor(
            name=doctor_name,
            department_id=dept_objects[dept_name].id,
            max_slots_per_day=max_slots
        )
        db.add(doc)
        print(f"👨‍⚕️ Doctor added: {doctor_name} ({max_slots} slots/day)")
    else:
        print(f"👨‍⚕️ Doctor exists: {doctor_name}")
    doctor_objects[doctor_name] = doc

db.commit()

# ======================================================
# Doctor Availability - CRITICAL FIX
# ======================================================
today = date.today()

# Create availabilities for next 14 days
for i in range(14):
    slot_date = today + timedelta(days=i)
    
    # Create availability for all doctors
    for doctor_name, doctor_obj in doctor_objects.items():
        # Check if availability already exists for this doctor on this date
        existing = db.query(models.DoctorAvailability).filter_by(
            doctor_id=doctor_obj.id,
            slot_date=slot_date
        ).first()
        
        if not existing:
            # Create generous availability slots
            time_slots = []
            
            # Morning slots
            for hour in range(9, 12):
                time_slots.append({"start": f"{hour:02d}:00", "end": f"{hour:02d}:30"})
                time_slots.append({"start": f"{hour:02d}:30", "end": f"{hour+1:02d}:00"})
            
            # Afternoon slots
            for hour in range(14, 17):
                time_slots.append({"start": f"{hour:02d}:00", "end": f"{hour:02d}:30"})
                time_slots.append({"start": f"{hour:02d}:30", "end": f"{hour+1:02d}:00"})
            
            availability = models.DoctorAvailability(
                doctor_id=doctor_obj.id,
                slot_date=slot_date,
                time_slots=time_slots,  # 12 slots per day (6 morning + 6 afternoon)
                reserved_count=0
            )
            db.add(availability)

db.commit()
print(f"📅 Created doctor availabilities for next 14 days (12 slots/day per doctor)")

# ======================================================
# Test: Create a sample request to verify auto-assignment
# ======================================================
print("\n🧪 Testing auto-assignment with sample request...")

# Create a test request
test_request_data = {
    "patient_id": 9999,
    "symptoms": "Testing skin rash and itching",
    "preferred_date": today + timedelta(days=1),
    "department_id": dept_objects["Dermatology"].id,
    "department_confidence": 0.95,
    "status": models.PreregStatus.PENDING
}

# Manually create to test
test_request = models.PreregistrationRequest(
    patient_id=test_request_data["patient_id"],
    symptoms=test_request_data["symptoms"],
    preferred_date=test_request_data["preferred_date"],
    department_id=test_request_data["department_id"],
    department_confidence=test_request_data["department_confidence"],
    status=test_request_data["status"],
    created_at=datetime.utcnow()
)

# Try to assign doctor
doctors_in_dept = db.query(models.Doctor).filter_by(
    department_id=test_request_data["department_id"]
).all()

assigned_doctor_id = None
for doctor in doctors_in_dept:
    availability = db.query(models.DoctorAvailability).filter_by(
        doctor_id=doctor.id,
        slot_date=test_request_data["preferred_date"]
    ).first()
    
    if availability and availability.reserved_count < len(availability.time_slots):
        assigned_doctor_id = doctor.id
        availability.reserved_count += 1
        test_request.accepted_by_doctor_id = assigned_doctor_id
        print(f"✅ Test: Auto-assigned Dr. {doctor.name} (Slot {availability.reserved_count}/{len(availability.time_slots)})")
        break

db.add(test_request)
db.commit()

# ======================================================
# Statistics
# ======================================================
print("\n" + "="*50)
print("📊 SEEDING SUMMARY")
print("="*50)

dept_count = db.query(models.Department).count()
doctor_count = db.query(models.Doctor).count()
availability_count = db.query(models.DoctorAvailability).count()
request_count = db.query(models.PreregistrationRequest).count()

print(f"🏥 Departments: {dept_count}")
print(f"👨‍⚕️ Doctors: {doctor_count}")
print(f"📅 Availability Slots: {availability_count}")
print(f"📋 Preregistration Requests: {request_count}")
print("="*50)

# Show availability details
print("\n📅 Availability Details (next 3 days):")
for i in range(3):
    check_date = today + timedelta(days=i)
    print(f"\nDate: {check_date}")
    
    for dept_name, dept_obj in dept_objects.items():
        doctors_in_dept = db.query(models.Doctor).filter_by(department_id=dept_obj.id).all()
        for doctor in doctors_in_dept:
            availability = db.query(models.DoctorAvailability).filter_by(
                doctor_id=doctor.id,
                slot_date=check_date
            ).first()
            
            if availability:
                available = len(availability.time_slots) - availability.reserved_count
                print(f"  {doctor.name}: {available}/{len(availability.time_slots)} slots available")

print("\n✅ Database seeding completed successfully!")
db.close()    