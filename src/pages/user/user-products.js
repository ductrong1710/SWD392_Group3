"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Heart, Eye, Search } from "lucide-react";
import { productsApi } from "../../services/product-api";
import { cartApi } from "../../services/cart-api";
import { useToast } from "../../contexts/ToastContext";
import UserProductDetail from "./user-product-detail";
import { fetchApi } from "../../services/base-api";
function parseFilter(selected) {
    if (!selected)
        return { type: "all" };
    if (selected.startsWith("gender:")) {
        const gender = selected.replace("gender:", "");
        return { type: "gender", value: gender };
    }
    return { type: "category", value: Number(selected) };
}
export default function UserProducts({ products, cart, setCart, selectedCategory, setSelectedCategory, selectedProductId, setSelectedProductId, }) {
    const [apiProducts, setApiProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [searchField, setSearchField] = useState("keyword");
    const [searchValue, setSearchValue] = useState("");
    const [isSearchMode, setIsSearchMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterLabel, setFilterLabel] = useState(null);
    const toast = useToast();
    useEffect(() => {
        loadCategories();
    }, []);
    useEffect(() => {
        loadProductsByFilter();
    }, [selectedCategory]);
    const loadProductsByFilter = async () => {
        try {
            setLoading(true);
            setIsSearchMode(false);
            const filter = parseFilter(selectedCategory);
            if (filter.type === "gender") {
                const response = await productsApi.getByGender(filter.value, 0, 20);
                setApiProducts(response.content);
                setFilterLabel(filter.value === "men" ? "Men's Fashion" : "Women's Fashion");
            }
            else if (filter.type === "category") {
                const response = await productsApi.search({ categoryId: filter.value });
                setApiProducts(response.content);
                const found = categories.find((c) => c.id === filter.value);
                setFilterLabel(found?.name ?? null);
            }
            else {
                const response = await productsApi.getAll(0, 20);
                setApiProducts(response.content);
                setFilterLabel(null);
            }
            setError(null);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load products");
            toast.error("Loading failed", "Could not load products");
        }
        finally {
            setLoading(false);
        }
    };
    const loadCategories = async () => {
        try {
            const data = await fetchApi("/v1/categories");
            setCategories(data);
        }
        catch {
            toast.warning("Categories unavailable", "Could not load categories");
            setCategories([]);
        }
    };
    const handleSearch = async () => {
        if (!searchValue.trim()) {
            setSelectedCategory(null);
            return;
        }
        try {
            setLoading(true);
            const params = {};
            if (searchField === "keyword") {
                params.keyword = searchValue;
            }
            else if (searchField === "brand") {
                params.brand = searchValue;
            }
            else if (searchField === "minPrice") {
                params.minPrice = parseFloat(searchValue);
            }
            else if (searchField === "maxPrice") {
                params.maxPrice = parseFloat(searchValue);
            }
            const response = await productsApi.search(params);
            setApiProducts(response.content);
            setSearchQuery(searchValue);
            setIsSearchMode(true);
            setError(null);
            toast.info("Search complete", `Found ${response.content.length} product(s)`);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to search products");
            toast.error("Search failed", "Could not complete your search");
        }
        finally {
            setLoading(false);
        }
    };
    const handleCategoryClick = (categoryId) => {
        if (categoryId === null) {
            setSelectedCategory(null);
            return;
        }
        const cat = categories.find((c) => c.id === categoryId);
        if (cat?.name === "Men's Fashion") {
            setSelectedCategory("gender:men");
        }
        else if (cat?.name === "Women's Fashion") {
            setSelectedCategory("gender:women");
        }
        else {
            setSelectedCategory(String(categoryId));
        }
    };
    const handleProductClick = (productId) => {
        setSelectedProductId(String(productId));
    };
    const handleCloseDetail = () => {
        setSelectedProductId(null);
    };
    const refreshCart = async () => {
        const data = await cartApi.getCart();
        setCart(data.items);
    };
    const displayProducts = apiProducts;
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-4 py-12", children: [_jsx("div", { className: "mb-8", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-serif font-semibold mb-2", children: filterLabel ? `${filterLabel} Collection` : "Shop Products" }), _jsx("p", { className: "text-muted-foreground", children: "Browse and add items to your cart" })] }), selectedCategory && (_jsx("button", { onClick: () => setSelectedCategory(null), className: "px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm font-medium", children: "\u2190 All Products" }))] }) }), loading && (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) })), error && (_jsxs("div", { className: "text-center py-12", children: [_jsxs("p", { className: "text-destructive", children: ["Error: ", error] }), _jsx("button", { onClick: loadProductsByFilter, className: "mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg", children: "Retry" })] })), !loading && !error && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-8 flex gap-4 items-center justify-between", children: [_jsxs("div", { className: "flex gap-3 flex-wrap", children: [_jsx("button", { onClick: () => handleCategoryClick(null), className: `px-4 py-2 rounded-lg font-medium transition-colors ${!selectedCategory
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-secondary text-foreground hover:bg-secondary/80"}`, children: "All" }), categories.map((cat) => {
                                        let isActive = false;
                                        if (cat.name === "Men's Fashion") {
                                            isActive = selectedCategory === "gender:men";
                                        }
                                        else if (cat.name === "Women's Fashion") {
                                            isActive = selectedCategory === "gender:women";
                                        }
                                        else {
                                            isActive = selectedCategory === String(cat.id);
                                        }
                                        return (_jsx("button", { onClick: () => handleCategoryClick(cat.id), className: `px-4 py-2 rounded-lg font-medium transition-colors ${isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-secondary text-foreground hover:bg-secondary/80"}`, children: cat.name }, cat.id));
                                    })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("select", { value: searchField, onChange: (e) => setSearchField(e.target.value), className: "px-3 py-2 border border-border rounded-lg text-sm bg-background", children: [_jsx("option", { value: "keyword", children: "Name" }), _jsx("option", { value: "brand", children: "Brand" }), _jsx("option", { value: "minPrice", children: "Min Price" }), _jsx("option", { value: "maxPrice", children: "Max Price" })] }), _jsx("input", { type: searchField.includes("Price") ? "number" : "text", value: searchValue, onChange: (e) => setSearchValue(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleSearch(), placeholder: `Search by ${searchField}...`, className: "px-4 py-2 border border-border rounded-lg text-sm bg-background w-64" }), _jsxs("button", { onClick: handleSearch, className: "px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2", children: [_jsx(Search, { className: "w-4 h-4" }), "Search"] })] })] }), isSearchMode && (_jsx("div", { className: "mb-4", children: _jsx("p", { className: "text-sm text-muted-foreground", children: displayProducts.length > 0
                                ? `Found ${displayProducts.length} product(s) for "${searchQuery}"`
                                : `No products found for "${searchQuery}"` }) })), displayProducts.length === 0 && !loading ? (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-muted-foreground text-lg", children: "No products found" }) })) : (_jsx("div", { className: "grid grid-cols-4 gap-6", children: displayProducts.map((product) => (_jsxs("div", { className: "group", children: [_jsxs("div", { onClick: () => handleProductClick(product.id), className: "bg-secondary rounded-lg h-64 mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer", children: [product.thumbnailUrl ? (_jsx("img", { src: product.thumbnailUrl, alt: product.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform" })) : (_jsx("span", { className: "text-muted-foreground text-sm", children: "No Image" })), _jsxs("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100", children: [_jsx("button", { onClick: (e) => {
                                                        e.stopPropagation();
                                                        handleProductClick(product.id);
                                                    }, className: "p-2 bg-white rounded-full text-foreground hover:bg-secondary transition-colors", children: _jsx(Eye, { className: "w-5 h-5" }) }), _jsx("button", { onClick: (e) => e.stopPropagation(), className: "p-2 bg-white rounded-full text-foreground hover:bg-secondary transition-colors", children: _jsx(Heart, { className: "w-5 h-5" }) })] })] }), _jsx("h3", { className: "font-semibold mb-1", children: product.name }), _jsx("div", { className: "flex items-center gap-2 mb-3", children: _jsx("span", { className: "text-sm text-muted-foreground", children: product.brandName }) }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-lg font-semibold", children: ["$", product.price.toFixed(2)] }), _jsx("button", { onClick: () => handleProductClick(product.id), className: "px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm font-medium", children: "View" })] })] }, product.id))) }))] })), selectedProductId && (_jsx(UserProductDetail, { productId: Number(selectedProductId), onClose: handleCloseDetail, onAddToCart: refreshCart }))] }));
}
