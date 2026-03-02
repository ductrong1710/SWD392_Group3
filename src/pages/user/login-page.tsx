"use client";

import type React from "react";
import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSwitchToRegister: () => void;
}

export default function LoginPage({ onLogin, onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Missing credentials", "Please enter email and password");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await onLogin(email, password);
      toast.success("Welcome back!", "You have signed in successfully");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      toast.error("Login failed", "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoRole: "user" | "admin") => {
    if (demoRole === "admin") {
      setEmail("admin@example.com");
      setPassword("123456");
    } else {
      setEmail("customer@example.com");
      setPassword("123456");
    }
    toast.info("Demo credentials filled", `${demoRole === "admin" ? "Admin" : "Customer"} credentials ready`);
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

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