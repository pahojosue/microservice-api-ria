const BASE_URL = "http://127.0.0.1:8001";

export const createPatient = async (firstName, lastName, gender, dob, phone, address, emergencyName, emergencyContact, userId) => {
    const response = await fetch(`${BASE_URL}/patients`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            first_name: firstName,
            last_name: lastName,
            gender: gender,
            date_of_birth: dob,
            phone: phone,
            address: address,
            emergency_contact_name: emergencyName,
            emergency_contact_phone: emergencyContact,
            user_id: userId
        }),
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        // in case backend sends empty body
    }

    return {
        ok: response.ok,
        status: response.status,
        data,
    };
}

export const getCurrentPatientData = async () => {
    const response = await fetch(`${BASE_URL}/patients/my-profile`, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

    let data = null;
    try {
        data = await response.json();
    } catch {
        // in case backend sends empty body
    }

    return {
        ok: response.ok,
        status: response.status,
        data,
    };
}