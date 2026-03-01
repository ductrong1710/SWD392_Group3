"use client"

import { X } from "lucide-react"

interface LoginModalProps {
  onClose: () => void
  onLogin: () => void
}

export default function LoginModal({ onClose, onLogin }: LoginModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-background rounded-lg max-w-sm w-full p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold">Sign In to Continue</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-muted-foreground mb-6">
          Please log in to add items to your cart and complete your purchase.
        </p>

        <div className="space-y-4">
          <button
            onClick={onLogin}
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Login
          </button>
          <button
            onClick={onClose}
            className="w-full py-2 border border-border rounded-lg font-medium hover:bg-secondary transition-colors"
          >
            Continue Browsing
          </button>
        </div>
      </div>
    </div>
  )
}
