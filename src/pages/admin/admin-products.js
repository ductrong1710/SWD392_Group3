"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useCallback } from "react";
import { Edit2, Trash2, Plus, Search, Menu } from "lucide-react";
import { productsApi } from "../../services/product-api";
import { useToast } from "../../contexts/ToastContext";
import ProductFormModal from "./ProductFormModal";
import ProductEditModal from "./ProductEditModal";
export default function AdminProducts({ products, setProducts, }) {
    const [selectedCategoryId, setSelectedCategoryId] = useState("");
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const toast = useToast();
    const [editingProductDetail, setEditingProductDetail] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isFetchingDetail, setIsFetchingDetail] = useState(null);
    useEffect(() => {
        loadProducts();
    }, []);
    const handleEditClick = async (productId) => {
        try {
            setIsFetchingDetail(productId);
            const detailData = await productsApi.getById(productId);
            setEditingProductDetail(detailData);
            setShowEditModal(true);
        }
        catch (error) {
            toast.error("Error", "Failed to retrieve product details");
        }
        finally {
            setIsFetchingDetail(null);
        }
    };
    const handleUpdateProduct = async (id, updateData) => {
        try {
            setIsSubmitting(true);
            const response = await productsApi.update(id, updateData);
            const updatedProducts = products.map((p) => {
                if (p.id === id) {
                    return {
                        ...p,
                        name: updateData.name,
                        brandName: updateData.brandName,
                        price: updateData.basePrice,
                        category: uniqueCategories.find((c) => c.id === updateData.categoryId) || p.category,
                    };
                }
                return p;
            });
            setProducts(updatedProducts);
            toast.success("Success", "Product information has been updated successfully");
            setShowEditModal(false);
        }
        catch (error) {
            toast.error("Update Failed", error.response?.data?.message || "An unknown error occurred");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleAddProduct = async (formData) => {
        try {
            setIsSubmitting(true);
            const response = await productsApi.create(formData);
            const images = response.productImages || [];
            const thumbnail = images.find((img) => img.isThumbnail)?.imageUrl ||
                images[0]?.imageUrl ||
                null;
            const newSummaryItem = {
                id: response.id,
                name: response.name,
                brandName: response.brandName,
                price: response.basePrice,
                thumbnailUrl: thumbnail,
            };
            setProducts([newSummaryItem, ...products]);
            toast.success("Success", "AI has classified and added the product successfully!");
            setShowAddModal(false);
        }
        catch (error) {
            // Lấy chính xác error message từ Response của Axios/Fetch
            const backendError = error.response?.data?.message || error.message;
            console.error("Error details:", error.response?.data);
            toast.error("Creation Failed", backendError || "Failed to create product");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const loadProducts = async () => {
        try {
            setIsLoading(true);
            const data = await productsApi.getAllUnpaged();
            const mappedProducts = data.map((item) => ({
                id: item.id,
                name: item.name,
                brandName: item.brandName,
                price: item.basePrice,
                thumbnailUrl: item.productImages?.find((img) => img.isThumbnail)?.imageUrl ||
                    null,
                category: item.category,
            }));
            setProducts(mappedProducts);
        }
        catch (error) {
            toast.error("Loading failed", "Could not load products");
        }
        finally {
            setIsLoading(false);
        }
    };
    const uniqueCategories = useMemo(() => {
        const map = new Map();
        products.forEach((p) => {
            if (p.category && !map.has(p.category.id)) {
                map.set(p.category.id, p.category);
            }
        });
        return Array.from(map.values());
    }, [products]);
    const filteredProducts = useMemo(() => {
        return products.filter((p) => {
            const matchSearch = p.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchCategory = selectedCategoryId === "" || p.category?.id === selectedCategoryId;
            return matchSearch && matchCategory;
        });
    }, [products, searchTerm, selectedCategoryId]);
    const handleDeleteProduct = useCallback(async (id) => {
        if (!window.confirm("Are you sure?"))
            return;
        try {
            await productsApi.delete(id);
            setProducts(products.filter((p) => p.id !== id));
            toast.success("Product deleted", "Product has been removed successfully");
        }
        catch (error) {
            toast.error("Delete failed", "Could not delete product");
        }
    }, [products, setProducts, toast]);
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-serif font-semibold", children: "Product Management" }), _jsxs("button", { onClick: () => setShowAddModal(true), className: "flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg", children: [_jsx(Plus, { className: "w-4 h-4" }), " Add Product"] })] }), _jsx("div", { className: "flex flex-col sm:flex-row items-start sm:items-center gap-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "flex-1 flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2", children: [_jsx(Search, { className: "w-4 h-4 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Search products by name...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "flex-1 bg-transparent outline-none text-sm" })] }), _jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => setShowCategoryMenu(!showCategoryMenu), className: `p-2 border border-border rounded-lg transition-colors flex items-center justify-center
              ${showCategoryMenu
                                        ? "bg-secondary"
                                        : "bg-background hover:bg-secondary"}
            `, title: "Filter by category", children: _jsx(Menu, { className: "w-5 h-5 text-foreground" }) }), showCategoryMenu && (_jsxs("div", { className: "absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl z-50 py-2 overflow-hidden", children: [_jsx("div", { className: "px-3 py-2 border-b border-border text-xs font-semibold text-muted-foreground uppercase", children: "CATEGORIES" }), _jsx("button", { className: `w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${selectedCategoryId === ""
                                                ? "font-bold text-primary bg-primary/10"
                                                : ""}`, onClick: () => {
                                                setSelectedCategoryId("");
                                                setShowCategoryMenu(false);
                                            }, children: "All Categories" }), uniqueCategories.map((cat) => (_jsx("button", { className: `w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${selectedCategoryId === cat.id
                                                ? "font-bold text-primary bg-primary/10"
                                                : ""}`, onClick: () => {
                                                setSelectedCategoryId(cat.id);
                                                setShowCategoryMenu(false);
                                            }, children: cat.name }, cat.id)))] }))] })] }) }), _jsx("div", { className: "bg-card border border-border rounded-lg overflow-hidden", children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-secondary border-b border-border", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left font-semibold", children: "Image" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold", children: "Product Name" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold", children: "Brand" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold", children: "Price" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold", children: "Actions" })] }) }), _jsxs("tbody", { children: [filteredProducts.map((product) => (_jsxs("tr", { className: "border-b border-border hover:bg-secondary/50 transition-colors", children: [_jsx("td", { className: "px-6 py-4", children: product.thumbnailUrl ? (_jsx("img", { src: product.thumbnailUrl, alt: product.name, className: "w-12 h-12 object-cover rounded" })) : (_jsx("div", { className: "w-12 h-12 bg-secondary rounded flex items-center justify-center text-xs text-muted-foreground", children: "No img" })) }), _jsx("td", { className: "px-6 py-4 font-medium", children: product.name }), _jsx("td", { className: "px-6 py-4 text-muted-foreground", children: product.brandName }), _jsxs("td", { className: "px-6 py-4 font-semibold", children: ["$", product.price.toFixed(2)] }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => handleEditClick(product.id), disabled: isFetchingDetail === product.id, className: "p-2 hover:bg-secondary rounded transition-colors disabled:opacity-50", children: isFetchingDetail === product.id ? (_jsx("span", { className: "w-4 h-4 block rounded-full border-2 border-primary border-t-transparent animate-spin" })) : (_jsx(Edit2, { className: "w-4 h-4 text-muted-foreground" })) }), _jsx("button", { onClick: () => handleDeleteProduct(product.id), disabled: isSubmitting, className: "p-2 hover:bg-secondary rounded transition-colors", children: _jsx(Trash2, { className: "w-4 h-4 text-destructive" }) })] }) })] }, product.id))), filteredProducts.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "px-6 py-8 text-center text-muted-foreground", children: "No products found" }) }))] })] }) }) }), _jsx(ProductFormModal, { isOpen: showAddModal, onClose: () => setShowAddModal(false), onSave: handleAddProduct, isSubmitting: isSubmitting }), _jsx(ProductEditModal, { isOpen: showEditModal, onClose: () => {
                    setShowEditModal(false);
                    setEditingProductDetail(null);
                }, onSave: handleUpdateProduct, productData: editingProductDetail, isSubmitting: isSubmitting, categories: uniqueCategories })] }));
}
