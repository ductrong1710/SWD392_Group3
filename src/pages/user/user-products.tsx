"use client";

import { useState, useEffect } from "react";
import { Heart, Eye, Search } from "lucide-react";
import { productsApi } from "../../services/product-api";
import { cartApi } from "../../services/cart-api";
import { useToast } from "../../contexts/ToastContext";
import type { ProductSummary, CartItem, Category } from "../../types";
import UserProductDetail from "./user-product-detail";
import { fetchApi } from "../../services/base-api";

interface UserProductsProps {
  products: ProductSummary[];
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
}

function parseFilter(
  selected: string | null
):
  | { type: "all" }
  | { type: "gender"; value: "men" | "women" }
  | { type: "category"; value: number } {
  if (!selected) return { type: "all" };
  if (selected.startsWith("gender:")) {
    const gender = selected.replace("gender:", "") as "men" | "women";
    return { type: "gender", value: gender };
  }
  return { type: "category", value: Number(selected) };
}

export default function UserProducts({
  products,
  cart,
  setCart,
  selectedCategory,
  setSelectedCategory,
  selectedProductId,
  setSelectedProductId,
}: UserProductsProps) {
  const [apiProducts, setApiProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchField, setSearchField] = useState<"keyword" | "brand" | "minPrice" | "maxPrice">("keyword");
  const [searchValue, setSearchValue] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterLabel, setFilterLabel] = useState<string | null>(null);
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
      } else if (filter.type === "category") {
        const response = await productsApi.search({ categoryId: filter.value });
        setApiProducts(response.content);
        const found = categories.find((c) => c.id === filter.value);
        setFilterLabel(found?.name ?? null);
      } else {
        const response = await productsApi.getAll(0, 20);
        setApiProducts(response.content);
        setFilterLabel(null);
      }

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      toast.error("Loading failed", "Could not load products");
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchApi<Category[]>("/v1/categories");
      setCategories(data);
    } catch {
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
      const params: Record<string, string | number> = {};

      if (searchField === "keyword") {
        params.keyword = searchValue;
      } else if (searchField === "brand") {
        params.brand = searchValue;
      } else if (searchField === "minPrice") {
        params.minPrice = parseFloat(searchValue);
      } else if (searchField === "maxPrice") {
        params.maxPrice = parseFloat(searchValue);
      }

      const response = await productsApi.search(params);
      setApiProducts(response.content);
      setSearchQuery(searchValue);
      setIsSearchMode(true);
      setError(null);
      toast.info("Search complete", `Found ${response.content.length} product(s)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search products");
      toast.error("Search failed", "Could not complete your search");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: number | null) => {
    if (categoryId === null) {
      setSelectedCategory(null);
      return;
    }

    const cat = categories.find((c) => c.id === categoryId);
    if (cat?.name === "Men's Fashion") {
      setSelectedCategory("gender:men");
    } else if (cat?.name === "Women's Fashion") {
      setSelectedCategory("gender:women");
    } else {
      setSelectedCategory(String(categoryId));
    }
  };

  const handleProductClick = (productId: number) => {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-semibold mb-2">
              {filterLabel ? `${filterLabel} Collection` : "Shop Products"}
            </h2>
            <p className="text-muted-foreground">Browse and add items to your cart</p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors text-sm font-medium"
            >
              ← All Products
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Error: {error}</p>
          <button
            onClick={loadProductsByFilter}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mb-8 flex gap-4 items-center justify-between">
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleCategoryClick(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                All
              </button>

              {categories.map((cat) => {
                let isActive = false;
                if (cat.name === "Men's Fashion") {
                  isActive = selectedCategory === "gender:men";
                } else if (cat.name === "Women's Fashion") {
                  isActive = selectedCategory === "gender:women";
                } else {
                  isActive = selectedCategory === String(cat.id);
                }

                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <select
                value={searchField}
                onChange={(e) =>
                  setSearchField(
                    e.target.value as "keyword" | "brand" | "minPrice" | "maxPrice"
                  )
                }
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
              >
                <option value="keyword">Name</option>
                <option value="brand">Brand</option>
                <option value="minPrice">Min Price</option>
                <option value="maxPrice">Max Price</option>
              </select>

              <input
                type={searchField.includes("Price") ? "number" : "text"}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder={`Search by ${searchField}...`}
                className="px-4 py-2 border border-border rounded-lg text-sm bg-background w-64"
              />

              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>
          </div>

          {isSearchMode && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                {displayProducts.length > 0
                  ? `Found ${displayProducts.length} product(s) for "${searchQuery}"`
                  : `No products found for "${searchQuery}"`}
              </p>
            </div>
          )}

          {displayProducts.length === 0 && !loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <div key={product.id} className="group">
                  <div
                    onClick={() => handleProductClick(product.id)}
                    className="bg-secondary rounded-lg h-64 mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer"
                  >
                    {product.thumbnailUrl ? (
                      <img
                        src={product.thumbnailUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <span className="text-muted-foreground text-sm">No Image</span>
                    )}

                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleProductClick(product.id);
                        }}
                        className="p-2 bg-white rounded-full text-foreground hover:bg-secondary transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-white rounded-full text-foreground hover:bg-secondary transition-colors"
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold mb-1">{product.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm text-muted-foreground">{product.brandName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">${product.price.toFixed(2)}</span>
                    <button
                      onClick={() => handleProductClick(product.id)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm font-medium"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedProductId && (
        <UserProductDetail
          productId={Number(selectedProductId)}
          onClose={handleCloseDetail}
          onAddToCart={refreshCart}
        />
      )}
    </div>
  );
}
