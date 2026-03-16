import { fetchApi } from "./base-api";
export const userApi = {
    getProfile: () => fetchApi("/v1/users/profile"),
    getAllUsers: () => fetchApi("/v1/users"),
    createUser: (payload) => fetchApi("/v1/users", {
        method: "POST",
        body: JSON.stringify(payload),
    }),
    updateUser: (userId, payload) => fetchApi(`/v1/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    }),
    deleteUser: (userId) => fetchApi(`/v1/users/${userId}`, {
        method: "DELETE",
    }),
};
