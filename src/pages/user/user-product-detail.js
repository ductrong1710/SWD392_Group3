"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { productsApi } from "../../services/product-api";
import { cartApi } from "../../services/cart-api";
import { useToast } from "../../contexts/ToastContext";
export default function UserProductDetail({ productId, onClose, onAddToCart, }) {
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState("");
    const [selectedSize, setSelectedSize] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const toast = useToast();
    useEffect(() => {
        if (productId) {
            loadProduct();
        }
    }, [productId]);
    const loadProduct = async () => {
        if (!productId)
            return;
        try {
            setIsLoading(true);
            const data = await productsApi.getById(productId);
            setProduct(data);
            if (data.productVariants.length > 0) {
                const colors = [...new Set(data.productVariants.map((v) => v.color))];
                if (colors.length > 0) {
                    const firstColor = colors[0];
                    setSelectedColor(firstColor);
                    const sizesForColor = data.productVariants
                        .filter((v) => v.color === firstColor)
                        .map((v) => v.size);
                    if (sizesForColor.length > 0) {
                        setSelectedSize(sizesForColor[0]);
                    }
                }
            }
            setError("");
        }
        catch {
            setError("Failed to load product");
            toast.error("Loading failed", "Could not load product details");
        }
        finally {
            setIsLoading(false);
        }
    };
    const getAvailableSizes = () => {
        if (!product)
            return [];
        return product.productVariants
            .filter((v) => v.color === selectedColor)
            .map((v) => v.size);
    };
    useEffect(() => {
        if (product && selectedColor) {
            const availableSizes = getAvailableSizes();
            if (availableSizes.length > 0 && !availableSizes.includes(selectedSize)) {
                setSelectedSize(availableSizes[0]);
            }
        }
    }, [selectedColor, product, selectedSize]);
    const getSelectedVariant = () => {
        return product?.productVariants.find((v) => v.color === selectedColor && v.size === selectedSize);
    };
    const handleAddToCart = async () => {
        const variant = getSelectedVariant();
        if (!variant) {
            toast.warning("Selection required", "Please select a color and size");
            return;
        }
        if (variant.stockQuantity < quantity) {
            toast.error("Insufficient stock", `Only ${variant.stockQuantity} item(s) available`);
            return;
        }
        try {
            setIsAddingToCart(true);
            await cartApi.addItem({
                productVariantId: variant.id,
                quantity,
            });
            await onAddToCart?.();
            toast.success("Added to cart", `${quantity} item(s) added to your cart`);
            onClose();
        }
        catch {
            toast.error("Failed to add", "Could not add item to cart. Please try again.");
        }
        finally {
            setIsAddingToCart(false);
        }
    };
    if (!productId)
        return null;
    return (_jsx("div", { className: "fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative", children: [_jsx("button", { onClick: onClose, className: "absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors z-10", children: _jsx(X, { className: "w-5 h-5" }) }), isLoading ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" }), _jsx("p", { className: "mt-4 text-muted-foreground", children: "Loading product..." })] })) : error || !product ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx("p", { className: "text-destructive mb-4", children: error || "Product not found" }), _jsx("button", { onClick: onClose, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg", children: "Close" })] })) : !product.isActive ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx("p", { className: "text-destructive mb-4", children: "Product is currently unavailable" }), _jsx("button", { onClick: onClose, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg", children: "Close" })] })) : (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 p-6", children: [_jsxs("div", { children: [_jsx("div", { className: "bg-secondary rounded-lg aspect-square flex items-center justify-center overflow-hidden mb-4", children: product.productImages.length > 0 && product.productImages[0].imageUrl ? (_jsx("img", { src: product.productImages.find((img) => img.isThumbnail)?.imageUrl ||
                                            product.productImages[0].imageUrl, alt: product.name, className: "w-full h-full object-cover" })) : (_jsx("span", { className: "text-muted-foreground", children: "No Image" })) }), product.productImages.length > 1 && (_jsx("div", { className: "grid grid-cols-4 gap-2", children: product.productImages.slice(0, 4).map((img) => (_jsx("div", { className: "bg-secondary rounded aspect-square overflow-hidden", children: _jsx("img", { src: img.imageUrl, alt: product.name, className: "w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity" }) }, img.id))) }))] }), _jsxs("div", { children: [_jsx("div", { className: "mb-2", children: _jsx("span", { className: "text-sm text-muted-foreground", children: product.brandName }) }), _jsx("h1", { className: "text-2xl font-serif font-bold mb-4", children: product.name }), _jsxs("p", { className: "text-2xl font-bold mb-4", children: ["$", (getSelectedVariant()?.priceOverride || product.basePrice).toFixed(2)] }), _jsx("p", { className: "text-sm text-muted-foreground mb-6", children: product.description }), product.productVariants.length > 0 && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm font-medium mb-2", children: "Color" }), _jsx("select", { value: selectedColor, onChange: (e) => setSelectedColor(e.target.value), className: "w-full px-3 py-2 border border-border rounded-lg text-sm bg-background", children: [...new Set(product.productVariants.map((v) => v.color))].map((color) => (_jsx("option", { value: color, children: color }, color))) })] }), _jsxs("div", { className: "mb-4", children: [_jsx("p", { className: "text-sm font-medium mb-2", children: "Size" }), _jsx("select", { value: selectedSize, onChange: (e) => setSelectedSize(e.target.value), className: "w-full px-3 py-2 border border-border rounded-lg text-sm bg-background", children: getAvailableSizes().map((size) => (_jsx("option", { value: size, children: size }, size))) })] })] })), getSelectedVariant() && (_jsx("p", { className: `text-sm mb-4 ${getSelectedVariant().stockQuantity > 0
                                        ? "text-green-600"
                                        : "text-destructive"}`, children: getSelectedVariant().stockQuantity > 0
                                        ? `${getSelectedVariant().stockQuantity} in stock`
                                        : "Out of stock" })), _jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("p", { className: "text-sm font-medium", children: "Quantity" }), _jsxs("div", { className: "flex items-center gap-2 border border-border rounded-lg", children: [_jsx("button", { onClick: () => setQuantity(Math.max(1, quantity - 1)), className: "p-2 hover:bg-secondary transition-colors", children: _jsx(Minus, { className: "w-4 h-4" }) }), _jsx("span", { className: "w-12 text-center font-medium", children: quantity }), _jsx("button", { onClick: () => setQuantity(Math.min(getSelectedVariant()?.stockQuantity || 999, quantity + 1)), className: "p-2 hover:bg-secondary transition-colors", children: _jsx(Plus, { className: "w-4 h-4" }) })] })] }), _jsxs("div", { className: "flex gap-3", children: [_jsxs("button", { onClick: handleAddToCart, disabled: (getSelectedVariant()?.stockQuantity || 0) === 0 || isAddingToCart, className: "flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50", children: [_jsx(ShoppingCart, { className: "w-4 h-4" }), isAddingToCart ? "Adding..." : "Add to Cart"] }), _jsx("button", { className: "p-2 border border-border rounded-lg hover:bg-secondary transition-colors", children: _jsx(Heart, { className: "w-4 h-4" }) })] }), _jsx("div", { className: "mt-6 pt-6 border-t border-border", children: _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Category: ", _jsx("span", { className: "text-foreground", children: product.category.name })] }) })] })] }))] }) }));
}
