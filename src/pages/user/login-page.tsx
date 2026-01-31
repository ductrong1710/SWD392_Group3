"use client";

import type React from "react";
import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { authApi, setToken } from "../../services/api";

interface LoginPageProps {
  onLogin: (email: string, role: "user" | "admin") => void;
  onSwitchToRegister: () => void;  // ← Đổi từ optional sang required
}

export default function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await authApi.login({ email, password });
      setToken(response.token);

      // Decode JWT to get role
      const payload = JSON.parse(atob(response.token.split(".")[1]));
      const role = payload.role?.toLowerCase() === "admin" ? "admin" : "user";

      onLogin(email, role);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo login (for development)
  const handleDemoLogin = (demoRole: "user" | "admin") => {
    if (demoRole === "admin") {
      setEmail("admin@example.com");
      setPassword("admin123");
    } else {
      setEmail("demo@example.com");
      setPassword("demo123");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-2">STYLE.</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-secondary rounded-lg space-y-3">
          <p className="text-sm font-medium">Quick Demo Login:</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleDemoLogin("user")}
              className="flex-1 py-2 px-3 text-sm border border-border rounded-lg hover:bg-background transition-colors"
            >
              Fill Customer
            </button>
            <button
              onClick={() => handleDemoLogin("admin")}
              className="flex-1 py-2 px-3 text-sm border border-border rounded-lg hover:bg-background transition-colors"
            >
              Fill Admin
            </button>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}