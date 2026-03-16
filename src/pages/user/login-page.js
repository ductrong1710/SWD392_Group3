"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Mail, Lock, Loader2 } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import LoginImg from "../../assets/img/LoginImg.jpg";
export default function LoginPage({ onLogin, onSwitchToRegister }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.warning("Missing credentials", "Please enter email and password");
            return;
        }
        setError("");
        setIsLoading(true);
        try {
            await onLogin(email, password);
            toast.success("Welcome back!", "You have signed in successfully");
        }
        catch (err) {
            setError("Invalid email or password. Please try again.");
            toast.error("Login failed", "Invalid email or password");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDemoLogin = (demoRole) => {
        if (demoRole === "admin") {
            setEmail("admin@example.com");
            setPassword("123456");
        }
        else {
            setEmail("customer@example.com");
            setPassword("123456");
        }
        toast.info("Demo credentials filled", `${demoRole === "admin" ? "Admin" : "Customer"} credentials ready`);
    };
    return (_jsxs("div", { className: "min-h-screen bg-background text-foreground flex", children: [_jsx("div", { className: "w-full lg:w-1/2 flex items-center justify-center px-8 py-12", children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "mb-10", children: [_jsx("h2", { className: "text-3xl font-bold mb-2", children: "Welcome Back" }), _jsx("p", { className: "text-muted-foreground", children: "Sign in to continue your shopping journey" })] }), _jsxs("form", { onSubmit: handleLogin, className: "space-y-6", children: [error && (_jsx("div", { className: "p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm", children: error })), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-3 w-5 h-5 text-muted-foreground" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your@email.com", className: "w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent", required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-3 w-5 h-5 text-muted-foreground" }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-accent", required: true })] })] }), _jsxs("button", { type: "submit", disabled: isLoading, className: "w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2", children: [isLoading && _jsx(Loader2, { className: "w-4 h-4 animate-spin" }), isLoading ? "Signing In..." : "Sign In"] })] }), _jsxs("div", { className: "mt-8 p-4 bg-secondary rounded-lg space-y-3", children: [_jsx("p", { className: "text-sm font-medium", children: "Quick Demo Login:" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handleDemoLogin("user"), className: "flex-1 py-2 px-3 text-sm border border-border rounded-lg hover:bg-background transition-colors", children: "Fill Customer" }), _jsx("button", { onClick: () => handleDemoLogin("admin"), className: "flex-1 py-2 px-3 text-sm border border-border rounded-lg hover:bg-background transition-colors", children: "Fill Admin" })] })] })] }) }), _jsxs("div", { className: "hidden lg:flex lg:w-1/2 bg-cover bg-center relative", style: { backgroundImage: `url(${LoginImg})` }, children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/60" }), _jsxs("div", { className: "relative z-10 flex flex-col justify-between w-full px-12 py-4 text-white", children: [_jsxs("div", { className: "text-right pt-12", children: [_jsx("h1", { className: "text-6xl font-serif font-bold mb-6 tracking-wider", children: "STYLE." }), _jsx("p", { className: "text-xl font-light mb-2", children: "Elevate Your Fashion Experience" }), _jsx("p", { className: "text-sm opacity-90 max-w-lg ml-auto leading-relaxed", children: "Discover the latest trends in fashion. Shop exclusive collections, premium quality products, and experience luxury shopping at your fingertips." })] }), _jsxs("div", { className: "space-y-4 text-center pb-24", children: [_jsxs("p", { className: "text-sm", children: ["Don't have an account?", " ", _jsx("button", { type: "button", onClick: onSwitchToRegister, className: "font-semibold underline hover:opacity-80 transition-opacity", children: "Sign up now" })] }), _jsx("p", { className: "text-sm", children: _jsx("button", { type: "button", className: "font-medium hover:opacity-80 transition-opacity underline", children: "Forgot your password?" }) })] })] })] })] }));
}
