import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
export default function ProductEditModal({ isOpen, onClose, onSave, productData, isSubmitting, categories }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        brandName: "",
        basePrice: 0,
        categoryId: 0,
        isActive: true
    });
    // Đổ data cũ vào form khi mở Modal
    useEffect(() => {
        if (productData && isOpen) {
            setFormData({
                name: productData.name || "",
                description: productData.description || "",
                brandName: productData.brandName || "",
                basePrice: productData.basePrice || 0,
                categoryId: productData.category?.id || 0,
                isActive: productData.isActive !== undefined ? productData.isActive : true
            });
        }
    }, [productData, isOpen]);
    if (!isOpen || !productData)
        return null;
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(productData.id, formData);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-card w-full max-w-2xl rounded-xl shadow-2xl flex flex-col", children: [_jsxs("div", { className: "p-6 border-b border-border flex justify-between items-center bg-card rounded-t-xl", children: [_jsx("h3", { className: "text-xl font-bold", children: "Edit Product" }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-secondary rounded-full", children: _jsx(X, {}) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold", children: "Product Name" }), _jsx("input", { required: true, className: "w-full p-2 border rounded", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold", children: "Brand Name" }), _jsx("input", { required: true, className: "w-full p-2 border rounded", value: formData.brandName, onChange: (e) => setFormData({ ...formData, brandName: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold", children: "Base Price ($)" }), _jsx("input", { required: true, type: "number", min: "0", step: "0.01", className: "w-full p-2 border rounded", value: formData.basePrice, onChange: (e) => setFormData({ ...formData, basePrice: e.target.value === "" ? 0 : parseFloat(e.target.value) }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold", children: "Category" }), _jsxs("select", { className: "w-full p-2 border rounded", value: formData.categoryId, onChange: (e) => setFormData({ ...formData, categoryId: Number(e.target.value) }), children: [_jsx("option", { value: 0, children: "Select Category" }), categories.map((cat) => (_jsx("option", { value: cat.id, children: cat.name }, cat.id)))] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold", children: "Description" }), _jsx("textarea", { required: true, className: "w-full p-2 border rounded h-32", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }) })] }), _jsxs("div", { className: "flex items-center gap-2 mt-4", children: [_jsx("input", { type: "checkbox", id: "isActive", checked: formData.isActive, onChange: (e) => setFormData({ ...formData, isActive: e.target.checked }) }), _jsx("label", { htmlFor: "isActive", className: "text-sm font-semibold cursor-pointer", children: "Product is Active (Visible to customers)" })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t mt-6", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-6 py-2 border rounded-lg", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "px-6 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50", children: isSubmitting ? "Saving..." : "Save Changes" })] })] })] }) }));
}
