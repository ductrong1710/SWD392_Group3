import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
export default function ProductFormModal({ isOpen, onClose, onSave, isSubmitting }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        brandName: "",
        basePrice: 0,
        images: [], // Thêm mảng images
        variants: [{ sku: "", color: "", size: "", priceOverride: 0, stockQuantity: 0, material: "" }]
    });
    if (!isOpen)
        return null;
    const addImage = () => {
        setFormData({
            ...formData,
            images: [...(formData.images || []), { imageUrl: "", isThumbnail: formData.images?.length === 0, color: "" }]
        });
    };
    const removeImage = (index) => {
        const newImages = formData.images?.filter((_, i) => i !== index) || [];
        // Đảm bảo luôn có 1 thumbnail nếu mảng còn phần tử
        if (newImages.length > 0 && !newImages.some(img => img.isThumbnail)) {
            newImages[0].isThumbnail = true;
        }
        setFormData({ ...formData, images: newImages });
    };
    const updateImage = (index, field, value) => {
        let newImages = [...(formData.images || [])];
        // Nếu set cái này làm thumbnail, bỏ thumbnail của các ảnh khác
        if (field === 'isThumbnail' && value === true) {
            newImages = newImages.map(img => ({ ...img, isThumbnail: false }));
        }
        newImages[index] = { ...newImages[index], [field]: value };
        setFormData({ ...formData, images: newImages });
    };
    const addVariant = () => {
        setFormData({
            ...formData,
            variants: [...formData.variants, { sku: "", color: "", size: "", priceOverride: 0, stockQuantity: 0, material: "" }]
        });
    };
    const removeVariant = (index) => {
        if (formData.variants.length <= 1)
            return;
        setFormData({
            ...formData,
            variants: formData.variants.filter((_, i) => i !== index)
        });
    };
    const updateVariant = (index, field, value) => {
        const newVariants = [...formData.variants];
        newVariants[index] = { ...newVariants[index], [field]: value };
        setFormData({ ...formData, variants: newVariants });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // ✅ 2. Ép chuẩn Type, bỏ ép kiểu "any", bỏ categoryId
        const cleanData = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            brandName: formData.brandName.trim(),
            basePrice: Number(formData.basePrice) || 0,
            images: formData.images?.map(img => ({
                imageUrl: img.imageUrl.trim(),
                isThumbnail: img.isThumbnail,
                color: img.color?.trim() || "Default"
            })) || [],
            variants: formData.variants?.map((v, i) => ({
                sku: v.sku.trim() || `SKU-${Date.now()}-${i}`,
                color: v.color.trim() || "Default",
                size: v.size.trim() || "Free",
                material: v.material.trim() || "Standard",
                priceOverride: Number(v.priceOverride) || 0,
                stockQuantity: Number(v.stockQuantity) || 0,
            }))
        };
        onSave(cleanData);
    };
    return (_jsx("div", { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-card w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl flex flex-col", children: [_jsxs("div", { className: "p-6 border-b border-border flex justify-between items-center sticky top-0 bg-card z-10", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-bold", children: "Add New Product" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Fill all required fields to create a product." })] }), _jsx("button", { onClick: onClose, className: "p-2 hover:bg-secondary rounded-full", children: _jsx(X, {}) })] }), _jsxs("form", { onSubmit: handleSubmit, className: "p-6 space-y-8", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold", children: "Product Name *" }), _jsx("input", { required: true, className: "w-full p-2 border rounded", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold", children: "Brand Name *" }), _jsx("input", { required: true, className: "w-full p-2 border rounded", value: formData.brandName, onChange: (e) => setFormData({ ...formData, brandName: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold", children: "Base Price ($) *" }), _jsx("input", { required: true, type: "number", min: "0", className: "w-full p-2 border rounded", value: formData.basePrice, onChange: (e) => setFormData({ ...formData, basePrice: e.target.valueAsNumber }) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("label", { className: "text-sm font-semibold", children: "Description (AI will classify based on this) *" }), _jsx("textarea", { required: true, className: "w-full p-2 border rounded h-[90%]", value: formData.description, onChange: (e) => setFormData({ ...formData, description: e.target.value }) })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h4", { className: "font-bold text-lg", children: "Images" }), _jsxs("button", { type: "button", onClick: addImage, className: "flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded text-sm", children: [_jsx(Plus, { className: "w-4 h-4" }), " Add Image"] })] }), formData.images?.map((img, index) => (_jsxs("div", { className: "flex gap-4 items-center p-3 border rounded-lg", children: [_jsx("input", { required: true, placeholder: "Image URL...", className: "flex-1 p-2 border rounded", value: img.imageUrl, onChange: (e) => updateImage(index, 'imageUrl', e.target.value) }), _jsx("input", { placeholder: "Color mapping", className: "w-32 p-2 border rounded", value: img.color, onChange: (e) => updateImage(index, 'color', e.target.value) }), _jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "radio", name: "thumbnail", checked: img.isThumbnail, onChange: () => updateImage(index, 'isThumbnail', true) }), _jsx("span", { className: "text-sm", children: "Thumbnail" })] }), _jsx("button", { type: "button", onClick: () => removeImage(index), className: "p-2 text-destructive", children: _jsx(Trash2, { className: "w-4 h-4" }) })] }, index)))] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h4", { className: "font-bold text-lg", children: "Variants" }), _jsxs("button", { type: "button", onClick: addVariant, className: "flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 text-sm", children: [_jsx(Plus, { className: "w-4 h-4" }), " Add Variant"] })] }), _jsx("div", { className: "border rounded-lg overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-secondary/50", children: _jsxs("tr", { children: [_jsx("th", { className: "p-3", children: "SKU" }), _jsx("th", { className: "p-3", children: "Color" }), _jsx("th", { className: "p-3", children: "Size" }), _jsx("th", { className: "p-3", children: "Material" }), _jsx("th", { className: "p-3", children: "Price Over." }), _jsx("th", { className: "p-3", children: "Stock" }), _jsx("th", { className: "p-3" })] }) }), _jsx("tbody", { className: "divide-y divide-border", children: formData.variants.map((v, index) => (_jsxs("tr", { className: "hover:bg-secondary/20", children: [_jsx("td", { className: "p-2", children: _jsx("input", { placeholder: "Auto", className: "w-24 p-1 border rounded", value: v.sku, onChange: (e) => updateVariant(index, 'sku', e.target.value) }) }), _jsx("td", { className: "p-2", children: _jsx("input", { placeholder: "Color", required: true, className: "w-20 p-1 border rounded", value: v.color, onChange: (e) => updateVariant(index, 'color', e.target.value) }) }), _jsx("td", { className: "p-2", children: _jsx("input", { placeholder: "Size", required: true, className: "w-16 p-1 border rounded", value: v.size, onChange: (e) => updateVariant(index, 'size', e.target.value) }) }), _jsx("td", { className: "p-2", children: _jsx("input", { placeholder: "Material", required: true, className: "w-24 p-1 border rounded", value: v.material, onChange: (e) => updateVariant(index, 'material', e.target.value) }) }), _jsx("td", { className: "p-2", children: _jsx("input", { type: "number", min: "0", required: true, className: "w-20 p-1 border rounded", value: v.priceOverride, onChange: (e) => updateVariant(index, 'priceOverride', e.target.valueAsNumber) }) }), _jsx("td", { className: "p-2", children: _jsx("input", { type: "number", min: "0", required: true, className: "w-20 p-1 border rounded", value: v.stockQuantity, onChange: (e) => updateVariant(index, 'stockQuantity', e.target.valueAsNumber) }) }), _jsx("td", { className: "p-2 text-center", children: _jsx("button", { type: "button", onClick: () => removeVariant(index), className: "text-destructive p-1 hover:bg-destructive/10 rounded", children: _jsx(Trash2, { className: "w-4 h-4" }) }) })] }, index))) })] }) })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-card", children: [_jsx("button", { type: "button", onClick: onClose, className: "px-6 py-2 border rounded-lg", children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "px-6 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50", children: isSubmitting ? "Processing..." : "Create Product" })] })] })] }) }));
}
