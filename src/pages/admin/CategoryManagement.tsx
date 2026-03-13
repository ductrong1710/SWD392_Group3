"use client";

import { useEffect, useState } from "react";
import { Edit2, Plus, Search, Trash2 } from "lucide-react";
import type { Category, CategoryRequest } from "../../types";
import { categoryApi } from "../../services/category-api";
import { useToast } from "../../contexts/ToastContext";

type FlattenedCategory = Category & {
  level: number;
};

function flattenCategories(
  categoryTree: Category[],
  level = 0
): FlattenedCategory[] {
  return categoryTree.flatMap((category) => [
    { ...category, level },
    ...flattenCategories(category.children ?? [], level + 1),
  ]);
}

function collectDescendantIds(category: Category): number[] {
  return (category.children ?? []).flatMap((child) => [
    child.id,
    ...collectDescendantIds(child),
  ]);
}

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CategoryRequest>({
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
    } catch (error) {
      toast.error("Error", "Could not load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        parentId: category.parentId ?? null,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: "", parentId: null });
    }

    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      setIsSubmitting(true);

      if (editingCategory) {
        await categoryApi.update(editingCategory.id, formData);
        toast.success("Success", "Category updated successfully");
      } else {
        await categoryApi.create(formData);
        toast.success("Success", "Category created successfully");
      }

      setIsModalOpen(false);
      await loadCategories();
    } catch (error: any) {
      toast.error("Error", error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await categoryApi.delete(id);
      await loadCategories();
      toast.success("Success", "Category deleted successfully");
    } catch (error) {
      toast.error("Error", "Could not delete category. It might be in use.");
    }
  };

  const flattenedCategories = flattenCategories(categories);
  const blockedParentIds = editingCategory
    ? new Set<number>([editingCategory.id, ...collectDescendantIds(editingCategory)])
    : new Set<number>();
  const availableParentOptions = flattenedCategories.filter(
    (category) => !blockedParentIds.has(category.id)
  );
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();
  const filteredCategories = flattenedCategories.filter((category) => {
    if (!normalizedSearchTerm) return true;

    return (
      category.name.toLowerCase().includes(normalizedSearchTerm) ||
      (category.parentName ?? "").toLowerCase().includes(normalizedSearchTerm)
    );
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif font-semibold">Category Management</h2>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">ID</th>
              <th className="px-6 py-3 text-left font-semibold">Name</th>
              <th className="px-6 py-3 text-left font-semibold">Parent</th>
              <th className="px-6 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr
                key={category.id}
                className="border-b border-border hover:bg-secondary/50"
              >
                <td className="px-6 py-4">{category.id}</td>
                <td className="px-6 py-4 font-medium">
                  <div
                    className="flex items-center gap-2"
                    style={{ paddingLeft: `${category.level * 24}px` }}
                  >
                    {category.level > 0 && (
                      <span className="text-xs text-muted-foreground">
                        L{category.level}
                      </span>
                    )}
                    <span>{category.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {category.parentName ?? "Root"}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="rounded p-2 transition-colors hover:bg-secondary"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="rounded p-2 transition-colors hover:bg-secondary"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  No categories found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Category Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Parent Category
                  </label>
                  <select
                    value={formData.parentId ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        parentId: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none"
                  >
                    <option value="">Root category</option>
                    {availableParentOptions.map((category) => (
                      <option key={category.id} value={category.id}>
                        {"  ".repeat(category.level)}
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-secondary"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
