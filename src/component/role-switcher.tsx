"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { ChevronDown } from "lucide-react";
import type { UserRole } from "../types/types";

interface RoleSwitcherProps {
  currentRole: UserRole;
  onRoleChange: Dispatch<SetStateAction<UserRole>>;
}

export default function RoleSwitcher({
  currentRole,
  onRoleChange,
}: RoleSwitcherProps) {
  const [open, setOpen] = useState(false);

  const roles = [
    { value: "guest", label: "Guest" },
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 bg-secondary rounded border border-border hover:bg-secondary/80 transition-colors text-sm font-medium"
      >
        Role: {currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}
        <ChevronDown className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => {
                onRoleChange(role.value as UserRole);
                setOpen(false);
              }}
              className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                currentRole === (role.value as UserRole)
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-secondary"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
