"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { LogOut } from "lucide-react";
export default function AdminHeader({ onLogout }) {
    return (_jsx("header", { className: "sticky top-0 bg-background border-b border-border z-50", children: _jsxs("div", { className: "px-6 py-4 flex items-center justify-between", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Admin Dashboard" }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs("button", { onClick: () => {
                            console.log("=== LOGOUT BUTTON CLICKED ===");
                            onLogout();
                        }, className: "flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded transition-colors text-sm", children: [_jsx(LogOut, { className: "w-4 h-4" }), "Logout"] }) })] }) }));
}
