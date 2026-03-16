"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from "react";
import { setToken, getToken, removeToken } from "../services/base-api";
import { authApi } from "../services/auth-api";
import { userApi } from "../services/user-api";
const AuthContext = createContext(undefined);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Check if user is already logged in
        const token = getToken();
        if (token) {
            loadUserProfile();
        }
        else {
            setIsLoading(false);
        }
    }, []);
    const loadUserProfile = async () => {
        try {
            const profile = await userApi.getProfile();
            setUser(profile);
        }
        catch (error) {
            console.error("Failed to load user profile:", error);
            removeToken();
        }
        finally {
            setIsLoading(false);
        }
    };
    const login = async (email, password) => {
        try {
            const response = await authApi.login({ email, password });
            setToken(response.token);
            const role = response.role?.toLowerCase() || 'user';
            await loadUserProfile();
            return { success: true, role };
        }
        catch (error) {
            console.error("Login failed:", error);
            return { success: false, role: '' };
        }
    };
    const register = async (data) => {
        try {
            const response = await authApi.register(data);
            setToken(response.token);
            await loadUserProfile();
            return { success: true };
        }
        catch (error) {
            console.error("Registration failed:", error);
            // error.message chính là đoạn text từ backend ném ra thông qua hàm fetchApi ở base-api.ts
            return { success: false, message: error.message || "Registration failed" };
        }
    };
    const logout = () => {
        removeToken();
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: {
            user,
            isAuthenticated: !!user,
            isLoading,
            login,
            register,
            logout,
        }, children: children }));
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
