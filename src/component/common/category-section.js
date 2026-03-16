"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchApi } from "../../services/base-api";
// Map category name → gender slug for gender-based filtering
const GENDER_MAP = {
    "Men's Fashion": "gender:men",
    "Women's Fashion": "gender:women",
};
export default function CategoriesSection({ setCurrentPage, setSelectedCategory, }) {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchApi("/v1/categories");
                // Only show top-level categories (parentId is null)
                const topLevel = data.filter((c) => c.parentId === null);
                setCategories(topLevel);
            }
            catch {
                setCategories([]);
            }
        };
        loadCategories();
    }, []);
    const handleCategoryClick = (category) => {
        // If it's a gender category, use gender slug; otherwise use categoryId
        const filterValue = GENDER_MAP[category.name] ?? String(category.id);
        setSelectedCategory(filterValue);
        setCurrentPage("products");
    };
    return (_jsxs("section", { className: "max-w-7xl mx-auto px-4", children: [_jsx("h3", { className: "text-2xl font-serif font-semibold mb-8", children: "Shop by Category" }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-6", children: categories.map((category) => (_jsx("button", { onClick: () => handleCategoryClick(category), className: "bg-secondary rounded-lg p-8 h-40 flex flex-col items-center justify-center hover:bg-secondary/80 transition-colors cursor-pointer", children: _jsx("h4", { className: "text-lg font-semibold text-foreground", children: category.name }) }, category.id))) })] }));
}
