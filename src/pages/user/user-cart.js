"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Trash2, Minus, Plus } from "lucide-react";
import { cartApi } from "../../services/cart-api";
import { useToast } from "../../contexts/ToastContext";
export default function UserCart({ cart, setCart, setCurrentPage, }) {
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    useEffect(() => {
        loadCart();
    }, []);
    const loadCart = async () => {
        try {
            setIsLoading(true);
            const data = await cartApi.getCart();
            setCart(data.items);
        }
        catch (error) {
            toast.error("Failed to load cart", "Please try again later");
        }
        finally {
            setIsLoading(false);
        }
    };
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const handleRemove = async (productVariantId) => {
        try {
            await cartApi.removeItem(productVariantId);
            setCart(cart.filter((item) => item.productVariantId !== productVariantId));
            toast.success("Item removed", "Item has been removed from your cart");
        }
        catch (error) {
            toast.error("Remove failed", "Could not remove item from cart");
        }
    };
    const handleQuantityChange = async (productVariantId, quantity) => {
        if (quantity <= 0)
            return;
        try {
            await cartApi.updateItem(productVariantId, { quantity });
            setCart(cart.map((item) => item.productVariantId === productVariantId ? { ...item, quantity } : item));
        }
        catch (error) {
            toast.error("Update failed", "Could not update quantity");
        }
    };
    if (isLoading) {
        return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" }), _jsx("p", { className: "mt-4 text-muted-foreground", children: "Loading cart..." })] }));
    }
    if (cart.length === 0) {
        return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12 text-center", children: [_jsx("h2", { className: "text-3xl font-serif font-semibold mb-4", children: "Your Cart" }), _jsx("p", { className: "text-muted-foreground mb-8", children: "Your cart is empty" }), _jsx("button", { onClick: () => setCurrentPage("products"), className: "px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium", children: "Continue Shopping" })] }));
    }
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12", children: [_jsx("h2", { className: "text-3xl font-serif font-semibold mb-8", children: "Your Cart" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2 space-y-4", children: cart.map((item) => (_jsxs("div", { className: "bg-card border border-border rounded-lg p-6 flex items-center gap-6", children: [_jsx("div", { className: "w-24 h-24 bg-secondary rounded flex items-center justify-center flex-shrink-0 overflow-hidden", children: item.imageUrl ? (_jsx("img", { src: item.imageUrl, alt: item.productName, className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-xs text-muted-foreground", children: "[Image]" })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold mb-2", children: item.productName }), _jsxs("p", { className: "text-sm text-muted-foreground mb-2", children: ["Color: ", item.color, " | Size: ", item.size] }), _jsxs("p", { className: "font-semibold", children: ["$", item.price.toFixed(2)] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => handleQuantityChange(item.productVariantId, item.quantity - 1), className: "p-1 hover:bg-secondary rounded", children: _jsx(Minus, { className: "w-4 h-4" }) }), _jsx("span", { className: "text-sm font-medium w-8 text-center", children: item.quantity }), _jsx("button", { onClick: () => handleQuantityChange(item.productVariantId, item.quantity + 1), className: "p-1 hover:bg-secondary rounded", children: _jsx(Plus, { className: "w-4 h-4" }) })] }), _jsx("button", { onClick: () => handleRemove(item.productVariantId), className: "p-2 hover:bg-destructive/10 rounded text-destructive transition-colors", children: _jsx(Trash2, { className: "w-5 h-5" }) })] }, item.productVariantId))) }), _jsx("div", { className: "lg:col-span-1", children: _jsxs("div", { className: "bg-card border border-border rounded-lg p-6 sticky top-20", children: [_jsx("h3", { className: "text-lg font-semibold mb-6", children: "Order Summary" }), _jsxs("div", { className: "space-y-3 mb-6 pb-6 border-b border-border", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Subtotal" }), _jsxs("span", { children: ["$", total.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Shipping" }), _jsx("span", { children: "$10.00" })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Tax" }), _jsxs("span", { children: ["$", (total * 0.1).toFixed(2)] })] })] }), _jsxs("div", { className: "flex justify-between font-semibold text-lg mb-6", children: [_jsx("span", { children: "Total" }), _jsxs("span", { children: ["$", (total + 10 + total * 0.1).toFixed(2)] })] }), _jsx("button", { onClick: () => setCurrentPage("checkout"), className: "w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium mb-3", children: "Proceed to Checkout" }), _jsx("button", { onClick: () => setCurrentPage("products"), className: "w-full px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium", children: "Continue Shopping" })] }) })] })] }));
}
