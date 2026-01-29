"use client";
import { Menu, LogOut, Bell } from "lucide-react";
import RoleSwitcher from "../component/role-switcher";
import type { Dispatch, SetStateAction } from "react";
import type { UserRole } from "../types/types";

interface AdminHeaderProps {
  setRole: Dispatch<SetStateAction<UserRole>>;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function AdminHeader({
  setRole,
  sidebarOpen,
  setSidebarOpen,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 bg-background border-b border-border z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden p-2 hover:bg-secondary rounded"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold hidden md:block">
          Admin Dashboard
        </h2>

        <div className="flex items-center gap-4 ml-auto">
          <button className="p-2 hover:bg-secondary rounded transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
          </button>

          <button
            onClick={() => setRole("guest")}
            className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>

          <RoleSwitcher currentRole="admin" onRoleChange={setRole} />
        </div>
      </div>
    </header>
  );
}
