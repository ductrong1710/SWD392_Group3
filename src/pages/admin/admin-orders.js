"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Search, CheckCircle, AlertTriangle, Package, Truck } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import { orderApi } from "../../services/order-api";
const STATUS_OPTIONS = [
    { value: "ALL", label: "All" },
    { value: "PREPARING", label: "Preparing" },
    { value: "SHIPPING", label: "Shipping" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "COMPLETED", label: "Completed" },
    { value: "NOT_RECEIVED", label: "Not Received" },
    { value: "CANCELLED", label: "Cancelled" },
];
export default function AdminOrders({ orders, setOrders }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    useEffect(() => {
        loadOrders();
    }, []);
    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const data = await orderApi.getAllOrders();
            setOrders(data);
        }
        catch {
            toast.error("Loading failed", "Could not load orders");
        }
        finally {
            setIsLoading(false);
        }
    };
    const updateTracking = async (orderId, newTracking) => {
        try {
            await orderApi.updateTracking(orderId, newTracking);
            setOrders(orders.map((o) => o.orderId === orderId ? { ...o, tracking: newTracking } : o));
            toast.success("Updated successfully", `Order #${orderId} → ${newTracking}`);
        }
        catch (error) {
            const msg = error instanceof Error ? error.message : "Unknown error";
            console.error("[updateTracking] error:", msg);
            toast.error("Error", `Unable to update: ${msg}`);
            await loadOrders();
        }
    };
    const getTrackingColor = (tracking) => {
        switch (tracking) {
            case "PREPARING":
                return "bg-yellow-100 text-yellow-800";
            case "SHIPPING":
                return "bg-indigo-100 text-indigo-800";
            case "DELIVERED":
                return "bg-green-100 text-green-800";
            case "COMPLETED":
                return "bg-green-200 text-green-900 font-bold";
            case "NOT_RECEIVED":
                return "bg-orange-100 text-orange-800 font-bold";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    const getTrackingLabel = (tracking) => {
        const found = STATUS_OPTIONS.find((s) => s.value === tracking);
        return found?.label ?? tracking;
    };
    const stats = {
        total: orders.length,
        preparing: orders.filter((o) => o.tracking === "PREPARING").length,
        shipping: orders.filter((o) => o.tracking === "SHIPPING").length,
        delivered: orders.filter((o) => o.tracking === "DELIVERED").length,
        completed: orders.filter((o) => o.tracking === "COMPLETED").length,
        notReceived: orders.filter((o) => o.tracking === "NOT_RECEIVED").length,
        cancelled: orders.filter((o) => o.status === "CANCELLED").length,
    };
    const filteredOrders = orders.filter((o) => {
        const matchSearch = o.orderId.toString().includes(searchTerm) ||
            (o.shippingAddress
                ? `${o.shippingAddress.fullName} ${o.shippingAddress.addressLine} ${o.shippingAddress.city}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                : false);
        const matchStatus = statusFilter === "ALL"
            ? true
            : statusFilter === "CANCELLED"
                ? o.status === "CANCELLED"
                : o.tracking === statusFilter;
        return matchSearch && matchStatus;
    });
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-b-2 border-primary" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-serif font-semibold", children: "Order Management" }), _jsxs("p", { className: "text-muted-foreground mt-1", children: ["Total: ", stats.total, " orders"] })] }), _jsx("button", { onClick: loadOrders, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90", children: "Refresh" })] }), _jsxs("div", { className: "grid grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-card border border-border rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/50", onClick: () => setStatusFilter("ALL"), children: [_jsx(Package, { className: "w-6 h-6 mx-auto mb-1 text-muted-foreground" }), _jsx("p", { className: "text-2xl font-bold", children: stats.total }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Total Orders" })] }), _jsxs("div", { className: "bg-card border border-border rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/50", onClick: () => setStatusFilter("DELIVERED"), children: [_jsx(Truck, { className: "w-6 h-6 mx-auto mb-1 text-green-500" }), _jsx("p", { className: "text-2xl font-bold text-green-600", children: stats.delivered }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Delivered" })] }), _jsxs("div", { className: "bg-green-50 border border-green-200 rounded-lg p-4 text-center cursor-pointer hover:bg-green-100", onClick: () => setStatusFilter("COMPLETED"), children: [_jsx(CheckCircle, { className: "w-6 h-6 mx-auto mb-1 text-green-600" }), _jsx("p", { className: "text-2xl font-bold text-green-700", children: stats.completed }), _jsx("p", { className: "text-xs text-green-700 font-medium", children: "Completed" })] }), _jsxs("div", { className: "bg-orange-50 border border-orange-200 rounded-lg p-4 text-center cursor-pointer hover:bg-orange-100", onClick: () => setStatusFilter("NOT_RECEIVED"), children: [_jsx(AlertTriangle, { className: "w-6 h-6 mx-auto mb-1 text-orange-500" }), _jsx("p", { className: "text-2xl font-bold text-orange-600", children: stats.notReceived }), _jsx("p", { className: "text-xs text-orange-700 font-medium", children: "Not Received" })] })] }), stats.notReceived > 0 && (_jsxs("div", { className: "bg-orange-50 border border-orange-300 rounded-lg px-4 py-3 flex items-center gap-3 text-orange-800 text-sm", children: [_jsx(AlertTriangle, { className: "w-5 h-5 shrink-0" }), _jsxs("span", { children: ["There are ", _jsx("strong", { children: stats.notReceived }), " orders reported as ", _jsx("strong", { children: "not received" }), ". Please review them."] }), _jsx("button", { onClick: () => setStatusFilter("NOT_RECEIVED"), className: "ml-auto px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700", children: "View Now" })] })), _jsxs("div", { className: "flex gap-3", children: [_jsxs("div", { className: "flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 flex-1", children: [_jsx(Search, { className: "w-4 h-4 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Search by order ID or address...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "flex-1 bg-transparent outline-none text-sm" })] }), _jsx("select", { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), className: "px-3 py-2 border border-border rounded-lg text-sm bg-background", children: STATUS_OPTIONS.map((s) => (_jsxs("option", { value: s.value, children: [s.label, s.value !== "ALL" && s.value !== "CANCELLED"
                                    ? ` (${orders.filter((o) => o.tracking === s.value).length})`
                                    : s.value === "CANCELLED"
                                        ? ` (${stats.cancelled})`
                                        : ""] }, s.value))) })] }), _jsx("div", { className: "bg-card border border-border rounded-lg overflow-hidden", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-secondary border-b border-border", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Customer" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Total Amount" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Tracking" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Payment" }), _jsx("th", { className: "px-4 py-3 text-left font-semibold", children: "Update Tracking" })] }) }), _jsxs("tbody", { children: [filteredOrders.map((order) => (_jsxs("tr", { className: `border-b border-border hover:bg-secondary/30 transition-colors ${order.tracking === "NOT_RECEIVED" ? "bg-orange-50" : ""}`, children: [_jsx("td", { className: "px-4 py-3 text-muted-foreground text-xs", children: order.shippingAddress
                                                ? `${order.shippingAddress.fullName} - ${order.shippingAddress.city}`
                                                : "N/A" }), _jsxs("td", { className: "px-4 py-3 font-medium", children: ["$", Number(order.finalAmount ?? 0).toLocaleString("en-US")] }), _jsx("td", { className: "px-4 py-3", children: _jsxs("span", { className: `px-2 py-1 rounded-full text-xs ${getTrackingColor(order.tracking)}`, children: [order.tracking === "NOT_RECEIVED" && "⚠️ ", getTrackingLabel(order.tracking)] }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("span", { className: `px-2 py-1 rounded text-xs ${order.status === "COMPLETED"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.status === "CANCELLED"
                                                        ? "bg-red-100 text-red-800"
                                                        : "bg-yellow-100 text-yellow-800"}`, children: order.status === "AWAITING_PAYMENT"
                                                    ? "Awaiting Payment"
                                                    : order.status === "COMPLETED"
                                                        ? "Paid"
                                                        : order.status === "CANCELLED"
                                                            ? "Cancelled"
                                                            : order.status }) }), _jsx("td", { className: "px-4 py-3", children: !["COMPLETED", "NOT_RECEIVED", "CANCELLED"].includes(order.tracking) &&
                                                order.status !== "CANCELLED" ? (_jsxs("select", { value: order.tracking || "", onChange: (e) => updateTracking(order.orderId, e.target.value), className: "text-xs border border-border rounded px-2 py-1 bg-background", children: [_jsx("option", { value: "", disabled: true, children: "-- Select status --" }), STATUS_OPTIONS
                                                        .filter((s) => !["ALL", "COMPLETED", "NOT_RECEIVED", "CANCELLED"].includes(s.value))
                                                        .map((s) => (_jsx("option", { value: s.value, children: s.label }, s.value)))] })) : (_jsx("span", { className: "text-xs text-muted-foreground italic", children: "Locked" })) })] }, order.orderId))), filteredOrders.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-4 py-8 text-center text-muted-foreground", children: "No orders found" }) }))] })] }) })] }));
}
