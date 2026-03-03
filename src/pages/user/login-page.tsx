"use client";

import type React from "react";
import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import LoginImg from "../../assets/img/LoginImg.jpg";

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
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to continue your shopping journey</p>
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
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
        </div>
      </div>

      {/* Right Side - Brand & Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${LoginImg})` }}
      >
        {/* Gradient Overlay - darker on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/60"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-4 text-white">
          {/* Top - Brand Section */}
          <div className="text-right pt-12">
            <h1 className="text-6xl font-serif font-bold mb-6 tracking-wider">STYLE.</h1>
            <p className="text-xl font-light mb-2">Elevate Your Fashion Experience</p>
            <p className="text-sm opacity-90 max-w-lg ml-auto leading-relaxed">
              Discover the latest trends in fashion. Shop exclusive collections, 
              premium quality products, and experience luxury shopping at your fingertips.
            </p>
          </div>

          {/* Bottom - Sign Up & Forgot Password */}
          <div className="space-y-4 text-center pb-24">
            <p className="text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSwitchToRegister}
                className="font-semibold underline hover:opacity-80 transition-opacity"
              >
                Sign up now
              </button>
            </p>
            <p className="text-sm">
              <button
                type="button"
                className="font-medium hover:opacity-80 transition-opacity underline"
              >
                Forgot your password?
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}