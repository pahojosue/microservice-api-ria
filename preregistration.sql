
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    department_id INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_doctor_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE RESTRICT
);
CREATE TABLE doctor_availability (
    id SERIAL PRIMARY KEY,
    doctor_id INTEGER NOT NULL,
    day_of_week VARCHAR(10) NOT NULL
        CHECK (day_of_week IN (
            'Monday','Tuesday','Wednesday',
            'Thursday','Friday','Saturday'
        )),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,

    CONSTRAINT fk_availability_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
        ON DELETE CASCADE,

    CONSTRAINT chk_time_order
        CHECK (start_time < end_time)
);
CREATE TABLE preregistration_requests (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL,
    department_id INTEGER NOT NULL,
    symptoms TEXT NOT NULL,
    desired_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_prereg_department
        FOREIGN KEY (department_id)
        REFERENCES departments(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_prereg_status
        CHECK (status IN ('pending','accepted','declined'))
);
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    preregistration_id INTEGER UNIQUE NOT NULL,
    doctor_id INTEGER NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_appointment_preregistration
        FOREIGN KEY (preregistration_id)
        REFERENCES preregistration_requests(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_appointment_doctor
        FOREIGN KEY (doctor_id)
        REFERENCES doctors(id)
        ON DELETE RESTRICT,

    CONSTRAINT chk_appointment_status
        CHECK (status IN ('scheduled','completed','cancelled'))
);
CREATE INDEX idx_prereg_status
ON preregistration_requests(status);

CREATE INDEX idx_prereg_department
ON preregistration_requests(department_id);

CREATE INDEX idx_doctor_department
ON doctors(department_id);

CREATE INDEX idx_appointment_date
ON appointments(appointment_date);

CREATE INDEX idx_doctor_availability
ON doctor_availability(doctor_id, day_of_week);