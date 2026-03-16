const API_BASE_URL = "https://swd392-group3.onrender.com/api";
// ============================================
// AUTH TOKEN MANAGEMENT
// ============================================
export const getToken = () => {
    return localStorage.getItem("token");
};
export const setToken = (token) => {
    localStorage.setItem("token", token);
};
export const removeToken = () => {
    localStorage.removeItem("token");
    console.log("[removeToken] token after removal:", localStorage.getItem("token")); // phải là null
};
// ============================================
// BASE FETCH WRAPPER
// ============================================
export async function fetchApi(endpoint, options = {}) {
    const token = getToken();
    const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(error || `HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    const contentLength = response.headers.get("content-length");
    if (response.status === 204 ||
        contentLength === "0" ||
        !contentType?.includes("application/json")) {
        return undefined;
    }
    return response.json();
}
