"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { User as UserIcon, Mail, Phone, MapPin, Edit2, Plus } from "lucide-react";
import { userApi } from "../../services/user-api";
import { useToast } from "../../contexts/ToastContext";
export default function UserProfilePage({ onBack }) {
    const [profile, setProfile] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const toast = useToast();
    useEffect(() => {
        loadProfile();
    }, []);
    const loadProfile = async () => {
        try {
            const data = await userApi.getProfile();
            setProfile(data);
        }
        catch (err) {
            setError("Failed to load profile");
            toast.error("Profile error", "Could not load your profile");
        }
        finally {
            setIsLoading(false);
        }
    };
    if (isLoading) {
        return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-12 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" }), _jsx("p", { className: "mt-4 text-muted-foreground", children: "Loading profile..." })] }));
    }
    if (error || !profile) {
        return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-12 text-center", children: [_jsx("p", { className: "text-destructive", children: error || "Profile not found" }), _jsx("button", { onClick: onBack, className: "mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg", children: "Go Back" })] }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-12", children: [_jsx("h2", { className: "text-3xl font-serif font-semibold mb-8", children: "My Profile" }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6 mb-8", children: [_jsxs("div", { className: "flex items-start justify-between mb-6", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Personal Information" }), _jsx("button", { className: "p-2 hover:bg-secondary rounded transition-colors", children: _jsx(Edit2, { className: "w-4 h-4" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(UserIcon, { className: "w-5 h-5 text-muted-foreground" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Full Name" }), _jsx("p", { className: "font-medium", children: profile.fullName })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Mail, { className: "w-5 h-5 text-muted-foreground" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Email" }), _jsx("p", { className: "font-medium", children: profile.email })] })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Phone, { className: "w-5 h-5 text-muted-foreground" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Phone" }), _jsx("p", { className: "font-medium", children: profile.phone || "Not set" })] })] })] })] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start justify-between mb-6", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Saved Addresses" }), _jsxs("button", { className: "flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add Address"] })] }), addresses.length > 0 ? (_jsx("div", { className: "space-y-4", children: addresses.map((address) => (_jsx("div", { className: `p-4 border rounded-lg ${address.isDefault ? "border-primary bg-primary/5" : "border-border"}`, children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx(MapPin, { className: "w-5 h-5 text-muted-foreground mt-0.5" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium", children: address.addressLine }), _jsx("p", { className: "text-sm text-muted-foreground", children: address.city })] })] }), address.isDefault && (_jsx("span", { className: "px-2 py-1 bg-primary/10 text-primary text-xs rounded font-medium", children: "Default" }))] }) }, address.id))) })) : (_jsx("p", { className: "text-muted-foreground text-center py-8", children: "No saved addresses yet" }))] })] }));
}
