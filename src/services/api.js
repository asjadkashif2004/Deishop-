const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Small helper for JSON calls
export async function apiFetch(path, options = {}) {
    const url = `${BASE_URL}${path}`;

    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    // Handle errors consistently
    if (!res.ok) {
        let errorBody = null;
        try { errorBody = await res.json(); } catch { }
        const message =
            errorBody?.error?.message || `Request failed: ${res.status} ${res.statusText}`;
        const err = new Error(message);
        err.status = res.status;
        err.body = errorBody;
        throw err;
    }

    // Some endpoints might return empty body
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}
