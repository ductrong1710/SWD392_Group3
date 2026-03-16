"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { checkoutApi } from "../../services/checkout-api";
import { useToast } from "../../contexts/ToastContext";
export default function UserCheckout({ cart, setCart, setOrders, setCurrentPage, }) {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        addressLine: "",
        city: "",
        paymentMethod: "VNPAY",
    });
    const toast = useToast();
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = 10;
    const tax = total * 0.1;
    const grandTotal = total + shipping + tax;
    const handleSubmit = async () => {
        if (!formData.fullName || !formData.phone || !formData.addressLine || !formData.city) {
            toast.warning("Missing information", "Please fill in all required fields");
            return;
        }
        if (step === 1) {
            setStep(2);
            toast.info("Step 2", "Please confirm your order");
            return;
        }
        try {
            setIsSubmitting(true);
            const response = await checkoutApi.checkout({
                shippingAddress: {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    addressLine: formData.addressLine,
                    city: formData.city,
                },
                paymentMethod: formData.paymentMethod,
            });
            if (formData.paymentMethod === "VNPAY" && response.paymentUrl) {
                toast.info("Redirecting", "Redirecting to VNPay payment gateway...");
                window.location.href = response.paymentUrl;
                return;
            }
            setOrders([]);
            setCart([]);
            toast.success("Order placed!", formData.paymentMethod === "COD"
                ? "Your order has been placed successfully with Cash on Delivery."
                : "Your order has been placed successfully.");
            setCurrentPage("orders");
        }
        catch {
            toast.error("Checkout failed", "Something went wrong. Please try again.");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12", children: [_jsx("h2", { className: "text-3xl font-serif font-semibold mb-8", children: "Checkout" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsxs("div", { className: "lg:col-span-2", children: [_jsxs("div", { className: "flex items-center gap-4 mb-12", children: [_jsx("div", { className: `flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`, children: "1" }), _jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" }), _jsx("div", { className: `flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`, children: "2" })] }), step === 1 && (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold mb-6", children: "Shipping Address" }), _jsx("input", { type: "text", placeholder: "Full Name *", value: formData.fullName, onChange: (e) => setFormData({ ...formData, fullName: e.target.value }), className: "w-full px-4 py-2 border border-border rounded-lg bg-background" }), _jsx("input", { type: "tel", placeholder: "Phone Number *", value: formData.phone, onChange: (e) => setFormData({ ...formData, phone: e.target.value }), className: "w-full px-4 py-2 border border-border rounded-lg bg-background" }), _jsx("input", { type: "text", placeholder: "Address Line *", value: formData.addressLine, onChange: (e) => setFormData({ ...formData, addressLine: e.target.value }), className: "w-full px-4 py-2 border border-border rounded-lg bg-background" }), _jsx("input", { type: "text", placeholder: "City *", value: formData.city, onChange: (e) => setFormData({ ...formData, city: e.target.value }), className: "w-full px-4 py-2 border border-border rounded-lg bg-background" })] })), step === 2 && (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-xl font-semibold mb-6", children: "Confirm Order" }), _jsxs("div", { className: "bg-secondary rounded-lg p-4 space-y-2 text-sm", children: [_jsx("p", { className: "font-medium mb-2", children: "Shipping Address" }), _jsxs("p", { children: [formData.fullName, " - ", formData.phone] }), _jsxs("p", { children: [formData.addressLine, ", ", formData.city] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("p", { className: "text-sm font-medium", children: "Payment Method" }), _jsxs("label", { className: "flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-lg cursor-pointer", children: [_jsx("input", { type: "radio", name: "payment", value: "VNPAY", checked: formData.paymentMethod === "VNPAY", onChange: () => setFormData({ ...formData, paymentMethod: "VNPAY" }), className: "w-4 h-4" }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "VNPay" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Pay securely via VNPay gateway" })] })] }), _jsxs("label", { className: "flex items-center gap-3 p-4 border border-border bg-background rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors", children: [_jsx("input", { type: "radio", name: "payment", value: "COD", checked: formData.paymentMethod === "COD", onChange: () => setFormData({ ...formData, paymentMethod: "COD" }), className: "w-4 h-4" }), _jsxs("div", { children: [_jsx("span", { className: "font-medium", children: "Cash on Delivery" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Pay in cash when your order is delivered" })] })] })] })] })), _jsxs("div", { className: "flex gap-4 mt-8", children: [step === 2 && (_jsx("button", { onClick: () => setStep(1), className: "px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium", children: "Back" })), _jsx("button", { onClick: handleSubmit, disabled: isSubmitting, className: "flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50", children: isSubmitting
                                            ? "Processing..."
                                            : step === 1
                                                ? "Continue"
                                                : formData.paymentMethod === "VNPAY"
                                                    ? "Pay with VNPay"
                                                    : "Place COD Order" })] })] }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-card border border-border rounded-lg p-6 sticky top-20", children: [_jsx("h3", { className: "text-lg font-semibold mb-6", children: "Order Summary" }), _jsx("div", { className: "space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto", children: cart.map((item) => (_jsxs("div", { className: "text-sm", children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "font-medium", children: item.productName }), _jsxs("span", { children: ["x", item.quantity] })] }), _jsxs("div", { className: "flex justify-between text-muted-foreground text-xs", children: [_jsxs("span", { children: [item.color, " / ", item.size] }), _jsxs("span", { children: ["$", (item.price * item.quantity).toLocaleString("en-US")] })] })] }, item.productVariantId))) }), _jsxs("div", { className: "space-y-3 mb-6 pb-6 border-b border-border", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Subtotal" }), _jsxs("span", { children: ["$", Number(total ?? 0).toLocaleString("en-US")] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Shipping" }), _jsxs("span", { children: ["$", Number(shipping ?? 0).toLocaleString("en-US")] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Tax (10%)" }), _jsxs("span", { children: ["$", Number(tax ?? 0).toLocaleString("en-US")] })] })] }), _jsxs("div", { className: "flex justify-between font-semibold text-lg", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["$", Number(grandTotal ?? 0).toLocaleString("en-US")] })] })] }) })] })] }));
}
