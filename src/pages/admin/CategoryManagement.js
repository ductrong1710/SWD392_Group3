"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import { categoryApi } from "../../services/category-api";
import { useToast } from "../../contexts/ToastContext";
function flattenCategories(categoryTree, level = 0) {
    return categoryTree.flatMap((category) => [
        { ...category, level },
        ...flattenCategories(category.children ?? [], level + 1),
    ]);
}
function collectDescendantIds(category) {
    return (category.children ?? []).flatMap((child) => [
        child.id,
        ...collectDescendantIds(child),
    ]);
}
export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        parentId: null,
    });
    const toast = useToast();
    useEffect(() => {
        loadCategories();
    }, []);
    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const data = await categoryApi.getAll();
            setCategories(data);
        }
        catch {
            toast.error("Error", "Could not load categories");
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleOpenModal = (category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                parentId: category.parentId ?? null,
            });
        }
        else {
            setEditingCategory(null);
            setFormData({ name: "", parentId: null });
        }
        setIsModalOpen(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim())
            return;
        try {
            setIsSubmitting(true);
            if (editingCategory) {
                await categoryApi.update(editingCategory.id, formData);
                toast.success("Success", "Category updated successfully");
            }
            else {
                await categoryApi.create(formData);
                toast.success("Success", "Category created successfully");
            }
            setIsModalOpen(false);
            await loadCategories();
        }
        catch (error) {
            toast.error("Error", error.message || "Something went wrong");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this category?")) {
            return;
        }
        try {
            await categoryApi.delete(id);
            await loadCategories();
            toast.success("Success", "Category deleted successfully");
        }
        catch {
            toast.error("Error", "Could not delete category. It might be in use.");
        }
    };
    const flattenedCategories = flattenCategories(categories);
    const blockedParentIds = editingCategory
        ? new Set([editingCategory.id, ...collectDescendantIds(editingCategory)])
        : new Set();
    const availableParentOptions = flattenedCategories.filter((category) => !blockedParentIds.has(category.id));
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredCategories = flattenedCategories.filter((category) => {
        if (!normalizedSearchTerm)
            return true;
        return (category.name.toLowerCase().includes(normalizedSearchTerm) ||
            (category.parentName ?? "").toLowerCase().includes(normalizedSearchTerm));
    });
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "h-12 w-12 animate-spin rounded-full border-b-2 border-primary" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-serif font-semibold", children: "Category Management" }), _jsxs("button", { onClick: () => handleOpenModal(), className: "flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90", children: [_jsx(Plus, { className: "h-4 w-4" }), " Add Category"] })] }), _jsx("div", { className: "flex flex-col items-start gap-4 sm:flex-row sm:items-center", children: _jsxs("div", { className: "flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-background px-3 py-2", children: [_jsx(Search, { className: "h-4 w-4 text-muted-foreground" }), _jsx("input", { type: "text", placeholder: "Search categories by name...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "flex-1 bg-transparent text-sm outline-none" })] }) }), _jsx("div", { className: "overflow-hidden rounded-lg border border-border bg-card", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "border-b border-border bg-secondary", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left font-semibold", children: "Name" }), _jsx("th", { className: "px-6 py-3 text-left font-semibold", children: "Actions" })] }) }), _jsxs("tbody", { children: [filteredCategories.map((category) => (_jsxs("tr", { className: "border-b border-border hover:bg-secondary/50", children: [_jsx("td", { className: "px-6 py-4 font-medium", children: _jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { children: category.name }) }) }), _jsx("td", { className: "px-6 py-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => handleOpenModal(category), className: "rounded p-2 transition-colors hover:bg-secondary", children: _jsx(Edit2, { className: "h-4 w-4 text-muted-foreground" }) }), _jsx("button", { onClick: () => handleDelete(category.id), className: "rounded p-2 transition-colors hover:bg-secondary", children: _jsx(Trash2, { className: "h-4 w-4 text-destructive" }) })] }) })] }, category.id))), filteredCategories.length === 0 && (_jsx("tr", { children: _jsx("td", { colSpan: 2, className: "px-6 py-8 text-center text-muted-foreground", children: "No categories found" }) }))] })] }) }), isModalOpen && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", children: _jsxs("div", { className: "w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl", children: [_jsx("h3", { className: "mb-4 text-lg font-semibold", children: editingCategory ? "Edit Category" : "Add New Category" }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm font-medium", children: "Category Name" }), _jsx("input", { type: "text", required: true, value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none", placeholder: "Enter category name" })] }), _jsxs("div", { children: [_jsx("label", { className: "mb-1 block text-sm font-medium", children: "Parent Category" }), _jsxs("select", { value: formData.parentId ?? "", onChange: (e) => setFormData({
                                                        ...formData,
                                                        parentId: e.target.value ? Number(e.target.value) : null,
                                                    }), className: "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none", children: [_jsx("option", { value: "", children: "Root category" }), availableParentOptions.map((category) => (_jsxs("option", { value: category.id, children: ["  ".repeat(category.level), category.name] }, category.id)))] })] })] }), _jsxs("div", { className: "mt-6 flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: () => setIsModalOpen(false), className: "rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary", disabled: isSubmitting, children: "Cancel" }), _jsx("button", { type: "submit", disabled: isSubmitting, className: "rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50", children: isSubmitting ? "Saving..." : "Save" })] })] })] }) }))] }));
}
