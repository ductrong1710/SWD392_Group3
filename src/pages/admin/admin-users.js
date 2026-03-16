"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { userApi, } from "../../services/user-api";
import { useToast } from "../../contexts/ToastContext";
export default function AdminUsers({ users, setUsers }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
    });
    const toast = useToast();
    useEffect(() => {
        loadUsers();
    }, []);
    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await userApi.getAllUsers();
            setUsers(data);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load users";
            setError(message);
            toast.error("Load failed", message);
        }
        finally {
            setLoading(false);
        }
    };
    const handleOpenModal = (user) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                fullName: user.fullName,
                email: user.email,
                phone: user.phone ?? "",
                password: "",
            });
        }
        else {
            setEditingUser(null);
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                password: "",
            });
        }
        setIsModalOpen(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.fullName.trim() || !formData.email.trim()) {
            toast.error("Validation error", "Name and email are required");
            return;
        }
        if (!editingUser && !formData.password?.trim()) {
            toast.error("Validation error", "Password is required when creating a user");
            return;
        }
        try {
            setIsSubmitting(true);
            if (editingUser) {
                await userApi.updateUser(editingUser.userId, {
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                });
                toast.success("Success", "User updated successfully");
            }
            else {
                await userApi.createUser({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                });
                toast.success("Success", "User created successfully");
            }
            setIsModalOpen(false);
            await loadUsers();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Something went wrong";
            toast.error("Error", message);
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (user) => {
        if (!window.confirm(`Are you sure you want to delete ${user.fullName}?`)) {
            return;
        }
        try {
            await userApi.deleteUser(user.userId);
            toast.success("Success", "User deleted successfully");
            await loadUsers();
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Could not delete user";
            toast.error("Error", message);
        }
    };
    const filteredUsers = users.filter((u) => u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.phone ?? "").toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-serif font-semibold", children: "User Management" }), _jsx("p", { className: "text-muted-foreground mt-1", children: "Manage customer accounts" })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: loadUsers, disabled: loading, className: "px-4 py-2 bg-background border border-border rounded-lg text-sm hover:bg-secondary transition-colors disabled:opacity-50", children: loading ? "Loading..." : "Refresh" }), _jsxs("button", { onClick: () => handleOpenModal(), className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90", children: [_jsx(Plus, { className: "h-4 w-4" }), "Add User"] })] })] }), _jsxs("div", { className: "flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2", children: [_jsx(Search, { className: "w-4 h-4 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Search users by name, email or phone...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "flex-1 bg-transparent outline-none text-sm" })] }), loading && (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-primary" }) })), error && !loading && (_jsxs("div", { className: "bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive flex items-center justify-between", children: [_jsx("span", { children: error }), _jsx("button", { onClick: loadUsers, className: "underline hover:no-underline", children: "Retry" })] })), !loading && !error && (_jsx("div", { className: "bg-card border border-border rounded-lg overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-secondary border-b border-border", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left font-semibold", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold", children: "Email" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold", children: "Phone" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold", children: "Actions" })] }) }), _jsxs("tbody", { children: [filteredUsers.map((user) => (_jsxs("tr", { className: "border-b border-border hover:bg-secondary/50 transition-colors", children: [_jsx("td", { className: "px-6 py-4 font-medium", children: user.fullName }), _jsx("td", { className: "px-6 py-4 text-muted-foreground", children: user.email }), _jsx("td", { className: "px-6 py-4 text-muted-foreground", children: user.phone || "N/A" }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => handleOpenModal(user), className: "rounded p-2 transition-colors hover:bg-secondary", children: _jsx(Edit2, { className: "h-4 w-4 text-muted-foreground" }) }), _jsx("button", { onClick: () => handleDelete(user), className: "rounded p-2 transition-colors hover:bg-secondary", children: _jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })] }) })] }, user.userId))), filteredUsers.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-6 py-8 text-center text-muted-foreground", children: "No users found" }) }))] })] }) }) })), _jsx("div", { className: "bg-secondary rounded-lg p-4 text-sm", children: _jsxs("p", { className: "font-medium", children: ["Total Users: ", _jsx("span", { className: "text-primary", children: users.length })] }) }), isModalOpen && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: _jsxs("div", { className: "w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl", children: [_jsx("h3", { className: "mb-4 text-lg font-semibold", children: editingUser ? "Edit User" : "Add New User" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm font-medium", children: "Full Name" }), _jsx("input", { type: "text", required: true, value: formData.fullName, onChange: (e) => setFormData({ ...formData, fullName: e.target.value }), className: "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none", placeholder: "Enter full name" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm font-medium", children: "Email" }), _jsx("input", { type: "email", required: true, value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none", placeholder: "Enter email" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm font-medium", children: "Phone" }), _jsx("input", { type: "text", value: formData.phone ?? "", onChange: (e) => setFormData({ ...formData, phone: e.target.value }), className: "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none", placeholder: "Enter phone number" })] }), !editingUser && (_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm font-medium", children: "Password" }), _jsx("input", { type: "password", required: true, value: formData.password ?? "", onChange: (e) => setFormData({ ...formData, password: e.target.value }), className: "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none", placeholder: "Enter password" })] }))] }), _jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary", disabled: isSubmitting, children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50", children: isSubmitting ? "Saving..." : "Save" })] })] })] }) }))] }));
}
