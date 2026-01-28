CREATE DATABASE preregistration_redo
;
-- Complete schema
CREATE TABLE departments (
id SERIAL PRIMARY KEY,
name VARCHAR(100) UNIQUE NOT NULL,
keyword_mappings JSONB NOT NULL,
created_at TIMESTAMP DEFAULT now()
);
CREATE TABLE doctors (
id SERIAL PRIMARY KEY,
name VARCHAR(200) NOT NULL,
department_id INTEGER REFERENCES departments(id),
max_slots_per_day INTEGER DEFAULT 10,
created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE doctor_availability (
id SERIAL PRIMARY KEY,
doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
slot_date DATE NOT NULL,
time_slots JSONB NOT NULL,
reserved_count INTEGER DEFAULT 0,
created_at TIMESTAMP DEFAULT now(),
UNIQUE(doctor_id, slot_date)
);
CREATE TABLE preregistration_requests (
id SERIAL PRIMARY KEY,
patient_id INTEGER NOT NULL,
symptoms TEXT NOT NULL,
preferred_date DATE NOT NULL,
department_id INTEGER REFERENCES departments(id),
department_confidence DECIMAL(3,2),
status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'scheduled', 'completed', 'cancelled')),
accepted_by_doctor_id INTEGER REFERENCES doctors(id),
created_at TIMESTAMP DEFAULT now()
);
CREATE TABLE appointments (
id SERIAL PRIMARY KEY,
request_id INTEGER UNIQUE REFERENCES preregistration_requests(id) ON DELETE CASCADE,
doctor_id INTEGER REFERENCES doctors(id),
department_id INTEGER REFERENCES departments(id),
reserved_slot_id INTEGER REFERENCES doctor_availability(id),
start_time TIMESTAMP NOT NULL,
end_time TIMESTAMP NOT NULL,
status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('pending', 'accepted', 'scheduled', 'completed', 'cancelled')),
created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX idx_requests_status_dept ON preregistration_requests(status, department_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);