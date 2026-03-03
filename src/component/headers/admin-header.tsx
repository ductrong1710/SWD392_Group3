"use client";
import { LogOut } from "lucide-react";

interface AdminHeaderProps {
  onLogout: () => void;
}

export default function AdminHeader({ onLogout }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 bg-background border-b border-border z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Admin Dashboard</h2>

        <div className="flex items-center gap-4">
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}