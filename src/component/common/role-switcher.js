"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
export default function RoleSwitcher({ currentRole, onRoleChange, }) {
    const [open, setOpen] = useState(false);
    const roles = [
        { value: "guest", label: "Guest" },
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" },
    ];
    return (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setOpen(!open), className: "flex items-center gap-2 px-3 py-2 bg-secondary rounded border border-border hover:bg-secondary/80 transition-colors text-sm font-medium", children: ["Role: ", currentRole.charAt(0).toUpperCase() + currentRole.slice(1), _jsx(ChevronDown, { className: "w-4 h-4" })] }), open && (_jsx("div", { className: "absolute right-0 mt-2 w-40 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50", children: roles.map((role) => (_jsx("button", { onClick: () => {
                        onRoleChange(role.value);
                        setOpen(false);
                    }, className: `w-full px-4 py-2 text-left text-sm transition-colors ${currentRole === role.value
                        ? "bg-accent text-accent-foreground font-medium"
                        : "hover:bg-secondary"}`, children: role.label }, role.value))) }))] }));
}
