"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { checkoutApi } from "../../services/checkout-api";
import { ordersApi } from "../../services/order-api";
import { useToast } from "../../contexts/ToastContext";
export default function PaymentResult({ setCurrentPage, setCart, setOrders, setSelectedOrderId, }) {
    const [status, setStatus] = useState("loading");
    const [orderId, setOrderId] = useState(null);
    const [message, setMessage] = useState("");
    const toast = useToast();
    useEffect(() => {
        verifyPayment();
    }, []);
    const verifyPayment = async () => {
        try {
            const params = new URLSearchParams(window.location.search);
            const vnpayParams = {};
            params.forEach((value, key) => {
                vnpayParams[key] = value;
            });
            if (!vnpayParams["vnp_ResponseCode"]) {
                setStatus("failed");
                setMessage("No payment information found");
                return;
            }
            const result = await checkoutApi.verifyVnpay(vnpayParams);
            if (result.success) {
                setStatus("success");
                setOrderId(result.orderId);
                toast.success("Payment successful!", "Your order has been confirmed");
                setCart([]);
                const updatedOrders = await ordersApi.getMyOrders();
                setOrders(updatedOrders);
                window.history.replaceState({}, "", window.location.pathname + "#/payment-result");
                setTimeout(() => {
                    if (result.orderId) {
                        setSelectedOrderId(String(result.orderId));
                    }
                    setCurrentPage("orders");
                }, 3000);
            }
            else {
                setStatus("failed");
                setOrderId(result.orderId || null);
                setMessage(result.message || "Payment verification failed");
                toast.error("Payment failed", result.message || "Please try again");
            }
        }
        catch {
            setStatus("failed");
            setMessage("Could not verify payment. Please contact support.");
            toast.error("Verification error", "Could not verify your payment");
        }
    };
    return (_jsxs("div", { className: "max-w-lg mx-auto px-4 py-24 text-center", children: [status === "loading" && (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "w-16 h-16 text-primary mx-auto animate-spin" }), _jsx("h2", { className: "text-2xl font-serif font-semibold mt-6 mb-2", children: "Verifying Payment..." }), _jsx("p", { className: "text-muted-foreground", children: "Please wait while we confirm your payment with VNPay." })] })), status === "success" && (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "w-16 h-16 text-green-600 mx-auto" }), _jsx("h2", { className: "text-2xl font-serif font-semibold mt-6 mb-2", children: "Payment Successful!" }), _jsxs("p", { className: "text-muted-foreground mb-2", children: ["Your order ", _jsxs("span", { className: "font-semibold text-primary", children: ["#", orderId] }), " has been confirmed."] }), _jsx("p", { className: "text-sm text-muted-foreground mb-8", children: "Redirecting to your orders..." }), _jsx("button", { onClick: () => {
                            if (orderId)
                                setSelectedOrderId(String(orderId));
                            setCurrentPage("orders");
                        }, className: "px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium", children: "View Order Now" })] })), status === "failed" && (_jsxs(_Fragment, { children: [_jsx(XCircle, { className: "w-16 h-16 text-destructive mx-auto" }), _jsx("h2", { className: "text-2xl font-serif font-semibold mt-6 mb-2", children: "Payment Failed" }), _jsx("p", { className: "text-muted-foreground mb-2", children: message }), orderId && (_jsxs("p", { className: "text-sm text-muted-foreground mb-6", children: ["Order ID: ", _jsxs("span", { className: "font-semibold", children: ["#", orderId] })] })), _jsxs("div", { className: "flex gap-4 justify-center", children: [_jsx("button", { onClick: () => setCurrentPage("cart"), className: "px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium", children: "Back to Cart" }), _jsx("button", { onClick: () => setCurrentPage("orders"), className: "px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium", children: "View Orders" })] })] }))] }));
}
