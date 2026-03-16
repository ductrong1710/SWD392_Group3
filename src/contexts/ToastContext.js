"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";
const ToastContext = createContext(undefined);
// Hook
export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
// Icons map
const iconMap = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
};
// Color map
const colorMap = {
    success: {
        bg: "bg-emerald-50 dark:bg-emerald-950/50",
        border: "border-emerald-200 dark:border-emerald-800",
        icon: "text-emerald-500",
        title: "text-emerald-800 dark:text-emerald-200",
        message: "text-emerald-600 dark:text-emerald-400",
        progress: "bg-emerald-500",
    },
    error: {
        bg: "bg-red-50 dark:bg-red-950/50",
        border: "border-red-200 dark:border-red-800",
        icon: "text-red-500",
        title: "text-red-800 dark:text-red-200",
        message: "text-red-600 dark:text-red-400",
        progress: "bg-red-500",
    },
    warning: {
        bg: "bg-amber-50 dark:bg-amber-950/50",
        border: "border-amber-200 dark:border-amber-800",
        icon: "text-amber-500",
        title: "text-amber-800 dark:text-amber-200",
        message: "text-amber-600 dark:text-amber-400",
        progress: "bg-amber-500",
    },
    info: {
        bg: "bg-blue-50 dark:bg-blue-950/50",
        border: "border-blue-200 dark:border-blue-800",
        icon: "text-blue-500",
        title: "text-blue-800 dark:text-blue-200",
        message: "text-blue-600 dark:text-blue-400",
        progress: "bg-blue-500",
    },
};
// Single Toast Item
function ToastItem({ toast, onRemove, }) {
    const colors = colorMap[toast.type];
    const Icon = iconMap[toast.type];
    const duration = toast.duration || 4000;
    return (_jsxs("div", { className: `relative flex items-start gap-3 p-4 rounded-lg border shadow-lg ${colors.bg} ${colors.border} animate-slide-in overflow-hidden min-w-[320px] max-w-[420px]`, role: "alert", children: [_jsx(Icon, { className: `w-5 h-5 mt-0.5 flex-shrink-0 ${colors.icon}` }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: `text-sm font-semibold ${colors.title}`, children: toast.title }), toast.message && (_jsx("p", { className: `text-sm mt-0.5 ${colors.message}`, children: toast.message }))] }), _jsx("button", { onClick: () => onRemove(toast.id), className: "flex-shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors", children: _jsx(X, { className: "w-4 h-4 text-gray-400" }) }), _jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-black/5 dark:bg-white/5", children: _jsx("div", { className: `h-full ${colors.progress} rounded-bl-lg`, style: {
                        animation: `toast-progress ${duration}ms linear forwards`,
                    } }) })] }));
}
// Provider
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);
    const addToast = useCallback((toast) => {
        const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const newToast = { ...toast, id };
        setToasts((prev) => [...prev, newToast]);
        // Auto remove
        const duration = toast.duration || 4000;
        setTimeout(() => {
            removeToast(id);
        }, duration);
    }, [removeToast]);
    const success = useCallback((title, message) => addToast({ type: "success", title, message }), [addToast]);
    const error = useCallback((title, message) => addToast({ type: "error", title, message }), [addToast]);
    const warning = useCallback((title, message) => addToast({ type: "warning", title, message }), [addToast]);
    const info = useCallback((title, message) => addToast({ type: "info", title, message }), [addToast]);
    return (_jsxs(ToastContext.Provider, { value: { toasts, addToast, removeToast, success, error, warning, info }, children: [children, _jsx("div", { className: "fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none", children: toasts.map((toast) => (_jsx("div", { className: "pointer-events-auto", children: _jsx(ToastItem, { toast: toast, onRemove: removeToast }) }, toast.id))) })] }));
}
