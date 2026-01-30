const BASE_URL = "http://127.0.0.1:8000";

export const loginUser = async (email, password, role) => {
    const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
            role: role
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

export const signupUser = async (email, password, role) => {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password,
            role: role
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