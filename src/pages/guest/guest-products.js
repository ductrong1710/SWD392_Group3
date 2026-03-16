"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Heart, Eye } from "lucide-react";
import { productsApi } from "../../services/product-api";
import { useToast } from "../../contexts/ToastContext";
function parseFilter(selected) {
    if (!selected)
        return { type: "all" };
    if (selected.startsWith("gender:")) {
        const gender = selected.replace("gender:", "");
        return { type: "gender", value: gender };
    }
    return { type: "category", value: Number(selected) };
}
export default function GuestProducts({ products, selectedCategory, setSelectedCategory, onCheckout, }) {
    const [apiProducts, setApiProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterLabel, setFilterLabel] = useState(null);
    const toast = useToast();
    useEffect(() => {
        loadProductsByFilter();
    }, [selectedCategory]);
    const loadProductsByFilter = async () => {
        try {
            setLoading(true);
            const filter = parseFilter(selectedCategory);
            if (filter.type === "gender") {
                const response = await productsApi.getByGender(filter.value, 0, 12);
                setApiProducts(response.content);
                setFilterLabel(filter.value === "men" ? "Men's Fashion" : "Women's Fashion");
            }
            else if (filter.type === "category") {
                const response = await productsApi.search({ categoryId: filter.value });
                setApiProducts(response.content);
                setFilterLabel(null);
            }
            else {
                const response = await productsApi.getAll(0, 12);
                setApiProducts(response.content);
                setFilterLabel(null);
            }
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load products');
            toast.error("Loading failed", "Could not load products");
        }
        finally {
            setLoading(false);
        }
    };
    const displayProducts = apiProducts.map((apiProduct) => ({
        id: apiProduct.id.toString(),
        name: apiProduct.name,
        price: apiProduct.price,
        brandName: apiProduct.brandName,
        thumbnailUrl: apiProduct.thumbnailUrl,
    }));
    const handleLoginRequired = () => {
        toast.info("Login required", "Please sign in to add items to cart");
        onCheckout();
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-serif font-semibold mb-2", children: filterLabel ? `${filterLabel} Collection` : "All Products" }), _jsx("p", { className: "text-muted-foreground", children: "Browse our collection. Login to add items to cart." })] }), selectedCategory && (_jsx("button", { onClick: () => setSelectedCategory(null), className: "px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm font-medium", children: "\u2190 All Products" }))] }) }), loading && (_jsxs("div", { className: "text-center py-12", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" }), _jsx("p", { className: "text-muted-foreground mt-4", children: "Loading Products..." })] })), error && (_jsx("div", { className: "text-center py-12", children: _jsxs("p", { className: "text-red-500", children: ["Error: ", error] }) })), !loading && !error && (_jsx(_Fragment, { children: displayProducts.length === 0 ? (_jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-muted-foreground text-lg", children: "No products found" }), selectedCategory && (_jsx("button", { onClick: () => setSelectedCategory(null), className: "mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90", children: "View All Products" }))] })) : (_jsx("div", { className: "grid grid-cols-4 gap-6", children: displayProducts.map((product) => (_jsxs("div", { className: "group", children: [_jsxs("div", { className: "bg-secondary rounded-lg h-64 mb-4 flex items-center justify-center relative overflow-hidden", children: [_jsx("img", { src: product.thumbnailUrl || "/placeholder.svg", alt: product.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform" }), _jsxs("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100", children: [_jsx("button", { onClick: handleLoginRequired, title: "Login required", className: "p-2 bg-white rounded-full text-foreground hover:bg-secondary transition-colors", children: _jsx(Eye, { className: "w-5 h-5" }) }), _jsx("button", { onClick: handleLoginRequired, title: "Login required", className: "p-2 bg-white rounded-full text-foreground hover:bg-secondary transition-colors", children: _jsx(Heart, { className: "w-5 h-5" }) })] })] }), _jsx("h3", { className: "font-semibold mb-1", children: product.name }), _jsx("div", { className: "flex items-center gap-2 mb-3", children: _jsx("span", { className: "text-sm text-muted-foreground", children: product.brandName }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-lg font-semibold", children: ["$", product.price.toFixed(2)] }), _jsx("button", { onClick: handleLoginRequired, className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm font-medium", children: "View" })] })] }, product.id))) })) }))] }));
}
