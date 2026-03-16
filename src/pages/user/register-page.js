"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Mail, Lock, User, Phone } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import SignUpImg from "../../assets/img/SignUpImg.jpg";
export default function RegisterPage({ onRegister, onSwitchToLogin, }) {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
            setError("Please fill in all required fields.");
            toast.error("Missing information", "Please fill in all required fields.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            toast.error("Password mismatch", "Passwords do not match.");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            toast.warning("Weak password", "Password must be at least 6 characters.");
            return;
        }
        try {
            setIsLoading(true);
            const success = await onRegister({
                fullName: formData.fullName.trim(),
                email: formData.email.trim(),
                password: formData.password,
                phone: formData.phone.trim(),
            });
            if (success) {
                toast.success("Account created", "Your account has been created successfully.");
            }
            else {
                setError("Registration failed. Email may already be in use.");
                toast.error("Registration failed", "Email may already be in use.");
            }
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-background text-foreground flex", children: [_jsx("div", { className: "w-full lg:w-1/2 flex items-center justify-center px-8 py-12", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-3xl font-bold mb-2", children: "Create Your Account" }), _jsx("p", { className: "text-muted-foreground", children: "Join STYLE and start exploring curated fashion picks." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [error && (_jsx("div", { className: "p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Full Name" }), _jsxs("div", { className: "relative", children: [_jsx(User, { className: "absolute left-3 top-3 w-5 h-5 text-muted-foreground" }), _jsx("input", { type: "text", value: formData.fullName, onChange: (e) => setFormData({ ...formData, fullName: e.target.value }), placeholder: "John Doe", className: "w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-3 w-5 h-5 text-muted-foreground" }), _jsx("input", { type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), placeholder: "you@example.com", className: "w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Phone Number" }), _jsxs("div", { className: "relative", children: [_jsx(Phone, { className: "absolute left-3 top-3 w-5 h-5 text-muted-foreground" }), _jsx("input", { type: "tel", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), placeholder: "0123456789", className: "w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-3 w-5 h-5 text-muted-foreground" }), _jsx("input", { type: "password", value: formData.password, onChange: (e) => setFormData({ ...formData, password: e.target.value }), placeholder: "Enter your password", className: "w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Confirm Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-3 w-5 h-5 text-muted-foreground" }), _jsx("input", { type: "password", value: formData.confirmPassword, onChange: (e) => setFormData({ ...formData, confirmPassword: e.target.value }), placeholder: "Re-enter your password", className: "w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent", required: true })] })] }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50", children: isLoading ? "Creating account..." : "Sign Up" }), _jsxs("p", { className: "text-sm text-center text-muted-foreground", children: ["Already have an account?", " ", _jsx("button", { type: "button", onClick: onSwitchToLogin, className: "font-semibold text-foreground underline hover:opacity-80", children: "Sign in" })] })] })] }) }), _jsxs("div", { className: "hidden lg:flex lg:w-1/2 bg-cover bg-center relative", style: { backgroundImage: `url(${SignUpImg})` }, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/60" }), _jsxs("div", { className: "relative z-10 flex flex-col justify-between w-full px-12 py-10 text-white", children: [_jsxs("div", { className: "text-right pt-12", children: [_jsx("h1", { className: "text-6xl font-serif font-bold mb-6 tracking-wider", children: "STYLE." }), _jsx("p", { className: "text-xl font-light mb-2", children: "Create Your Fashion Identity" }), _jsx("p", { className: "text-sm opacity-90 max-w-lg ml-auto leading-relaxed", children: "Sign up to discover new arrivals, personalized recommendations, and exclusive offers curated for your style." })] }), _jsx("div", { className: "text-right pb-10", children: _jsx("p", { className: "text-sm opacity-90", children: "Fast signup. Instant access. Seamless shopping." }) })] })] })] }));
}
