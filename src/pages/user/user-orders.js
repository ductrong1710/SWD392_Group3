"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, AlertTriangle, } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import { orderApi } from "../../services/order-api";
export default function UserOrders({ setSelectedOrderId }) {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [confirmingOrderId, setConfirmingOrderId] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        orderId: null,
        action: null,
        title: "",
        message: "",
        confirmText: "",
        confirmClassName: "",
    });
    const toast = useToast();
    useEffect(() => {
        loadOrders();
    }, []);
    const loadOrders = async () => {
        try {
            setIsLoading(true);
            const data = await orderApi.getMyOrders();
            setOrders(data);
        }
        catch {
            toast.error("Loading failed", "Could not load orders");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleConfirmReceived = (orderId) => {
        setConfirmDialog({
            open: true,
            orderId,
            action: "received",
            title: "Confirm Delivery",
            message: "Do you confirm that you have received this order?",
            confirmText: "Yes, I received it",
            confirmClassName: "bg-green-600 hover:bg-green-700",
        });
    };
    const handleNotReceived = (orderId) => {
        setConfirmDialog({
            open: true,
            orderId,
            action: "notReceived",
            title: "Report Not Received",
            message: "Do you confirm that you have not received this order?",
            confirmText: "Yes, report it",
            confirmClassName: "bg-orange-500 hover:bg-orange-600",
        });
    };
    const handleConfirmAction = async () => {
        if (!confirmDialog.orderId || !confirmDialog.action)
            return;
        const orderId = confirmDialog.orderId;
        const action = confirmDialog.action;
        try {
            setConfirmingOrderId(orderId);
            if (action === "received") {
                await orderApi.confirmReceived(orderId);
                setOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, tracking: "COMPLETED" } : o));
                toast.success("Success", "The order has been confirmed as completed.");
            }
            else {
                await orderApi.reportNotReceived(orderId);
                setOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, tracking: "NOT_RECEIVED" } : o));
                toast.warning("Recorded", "Your report has been received. We will review it soon.");
            }
            setConfirmDialog((prev) => ({ ...prev, open: false }));
        }
        catch {
            toast.error("Error", action === "received"
                ? "Could not confirm the order. Please try again."
                : "Could not submit the report. Please try again.");
        }
        finally {
            setConfirmingOrderId(null);
        }
    };
    const closeConfirmDialog = () => {
        if (confirmingOrderId !== null)
            return;
        setConfirmDialog({
            open: false,
            orderId: null,
            action: null,
            title: "",
            message: "",
            confirmText: "",
            confirmClassName: "",
        });
    };
    const getTrackingIcon = (tracking) => {
        switch (tracking) {
            case "PREPARING":
                return _jsx(Clock, { className: "w-5 h-5 text-yellow-500" });
            case "SHIPPING":
                return _jsx(Truck, { className: "w-5 h-5 text-blue-500" });
            case "DELIVERED":
                return _jsx(Package, { className: "w-5 h-5 text-green-500" });
            case "COMPLETED":
                return _jsx(CheckCircle, { className: "w-5 h-5 text-green-600" });
            case "NOT_RECEIVED":
                return _jsx(AlertTriangle, { className: "w-5 h-5 text-orange-500" });
            default:
                return _jsx(Package, { className: "w-5 h-5 text-gray-500" });
        }
    };
    const getTrackingColor = (tracking) => {
        switch (tracking) {
            case "PREPARING":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "SHIPPING":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "DELIVERED":
                return "bg-green-100 text-green-800 border-green-200";
            case "COMPLETED":
                return "bg-green-200 text-green-900 border-green-300";
            case "NOT_RECEIVED":
                return "bg-orange-100 text-orange-800 border-orange-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };
    const getTrackingLabel = (tracking) => {
        switch (tracking) {
            case "PREPARING":
                return "Preparing";
            case "SHIPPING":
                return "Shipping";
            case "DELIVERED":
                return "Delivered";
            case "COMPLETED":
                return "Completed";
            case "NOT_RECEIVED":
                return "Not Received";
            default:
                return tracking || "Processing";
        }
    };
    const getPaymentStatusLabel = (status) => {
        switch (status) {
            case "AWAITING_PAYMENT":
                return "Awaiting Payment";
            case "COMPLETED":
                return "Paid";
            case "CANCELLED":
                return "Cancelled";
            default:
                return status;
        }
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }));
    }
    if (orders.length === 0) {
        return (_jsxs("div", { className: "text-center py-20", children: [_jsx(Package, { className: "w-16 h-16 text-muted-foreground mx-auto mb-4" }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: "No orders yet" }), _jsx("p", { className: "text-muted-foreground", children: "Start shopping to place your first order." })] }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-4 py-12 space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-3xl font-serif font-semibold", children: "My Orders" }), _jsx("button", { onClick: loadOrders, className: "px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors", children: "Refresh" })] }), orders.map((order) => (_jsxs("div", { className: "bg-card border border-border rounded-xl p-6 space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [getTrackingIcon(order.tracking), _jsxs("div", { children: [_jsxs("p", { className: "font-semibold text-lg", children: ["Order #", order.orderId] }), _jsx("p", { className: "text-sm text-muted-foreground", children: order.orderDate ? new Date(order.orderDate).toLocaleDateString("vi-VN") : "" })] })] }), _jsxs("div", { className: "flex flex-col items-end gap-1", children: [order.tracking && (_jsx("span", { className: `px-3 py-1 rounded-full text-xs font-semibold border ${getTrackingColor(order.tracking)}`, children: getTrackingLabel(order.tracking) })), _jsx("span", { className: "px-2 py-0.5 rounded text-xs text-muted-foreground bg-secondary", children: getPaymentStatusLabel(order.status) })] })] }), _jsxs("div", { className: "text-sm text-muted-foreground space-y-1", children: [order.shippingAddress && (_jsxs("p", { children: [_jsx("span", { className: "font-medium text-foreground", children: "Address:" }), " ", order.shippingAddress.addressLine, ", ", order.shippingAddress.city] })), _jsxs("p", { children: [_jsx("span", { className: "font-medium text-foreground", children: "Payment:" }), " ", order.paymentMethod] }), _jsxs("p", { children: [_jsx("span", { className: "font-medium text-foreground", children: "Total:" }), " ", _jsxs("span", { className: "text-primary font-semibold text-base", children: ["$", Number(order.finalAmount ?? 0).toLocaleString("en-US")] })] })] }), order.items && order.items.length > 0 && (_jsx("div", { className: "border-t border-border pt-3 space-y-2", children: order.items.map((item, idx) => (_jsxs("div", { className: "flex items-center gap-3 text-sm", children: [item.imageUrl && (_jsx("img", { src: item.imageUrl, alt: item.productName, className: "w-12 h-12 rounded object-cover border border-border" })), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "font-medium truncate", children: item.productName }), _jsxs("p", { className: "text-muted-foreground text-xs", children: [item.variantInfo, " x ", item.quantity] })] }), _jsxs("p", { className: "font-medium shrink-0", children: ["$", Number(item.itemTotal ?? 0).toLocaleString("en-US")] })] }, idx))) })), order.tracking === "DELIVERED" && (_jsxs("div", { className: "border-t border-border pt-4", children: [_jsx("p", { className: "text-sm text-muted-foreground mb-3", children: "This order has been delivered. Please confirm:" }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: () => handleConfirmReceived(order.orderId), disabled: confirmingOrderId === order.orderId, className: "flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), confirmingOrderId === order.orderId ? "Processing..." : "Received"] }), _jsxs("button", { onClick: () => handleNotReceived(order.orderId), disabled: confirmingOrderId === order.orderId, className: "flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm disabled:opacity-50", children: [_jsx(AlertTriangle, { className: "w-4 h-4" }), confirmingOrderId === order.orderId ? "Processing..." : "Not Received"] })] })] })), order.tracking === "COMPLETED" && (_jsxs("div", { className: "border-t border-border pt-4 flex items-center gap-2 text-green-600 text-sm font-medium", children: [_jsx(CheckCircle, { className: "w-4 h-4" }), "You have confirmed successful delivery"] })), order.tracking === "NOT_RECEIVED" && (_jsxs("div", { className: "border-t border-border pt-4 flex items-center gap-2 text-orange-600 text-sm font-medium", children: [_jsx(AlertTriangle, { className: "w-4 h-4" }), "Your report has been recorded. Admin is reviewing it."] }))] }, order.orderId)))] }));
}
