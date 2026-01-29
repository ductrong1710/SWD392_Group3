"use client"

import type React from "react"
import { useState } from "react"
import { Mail, Lock } from "lucide-react"

interface LoginPageProps {
  onLogin: (email: string, role: "user" | "admin") => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<"user" | "admin">("user")

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onLogin(email, selectedRole)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold mb-2">STYLE.</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium mb-3">Login As</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("user")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedRole === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("admin")}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                  selectedRole === "admin"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                Admin
              </button>
            </div>
          </div>

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
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-secondary rounded-lg space-y-2">
          <p className="text-sm font-medium">Demo Credentials:</p>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>
              <span className="font-mono">Customer:</span> demo@example.com / demo123
            </p>
            <p>
              <span className="font-mono">Admin:</span> admin@example.com / admin123
            </p>
          </div>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <button className="text-primary hover:underline font-medium">Sign up</button>
        </p>
      </div>
    </div>
  )
}
