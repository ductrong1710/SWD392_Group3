"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { setToken, getToken, removeToken } from "../services/base-api";
import { authApi } from "../services/auth-api";
import { userApi } from "../services/user-api";
import { User as UserProfile } from "../types";
interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; role: string }>;
register: (data: { fullName: string; email: string; password: string; phone: string }) => Promise<{ success: boolean; message?: string }>;  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = getToken();
    if (token) {
      loadUserProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await userApi.getProfile();
      setUser(profile);
    } catch (error) {
      console.error("Failed to load user profile:", error);
      removeToken();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      setToken(response.token);
      
      const role = response.role?.toLowerCase() || 'user';
      
      await loadUserProfile();
      return { success: true, role };
    } catch (error) {
      console.error("Login failed:", error);
      return { success: false, role: '' };
    }
  };

 const register = async (data: { fullName: string; email: string; password: string; phone: string }) => {
    try {
      const response = await authApi.register(data);
      setToken(response.token);
      await loadUserProfile();
      return { success: true };
    } catch (error: any) {
      console.error("Registration failed:", error);
      // error.message chính là đoạn text từ backend ném ra thông qua hàm fetchApi ở base-api.ts
      return { success: false, message: error.message || "Registration failed" }; 
    }
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}