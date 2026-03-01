"use client"

import { useState, useEffect } from "react"
import { Heart, Eye, Search } from "lucide-react"
import { productsApi } from "../../services/product-api"
import type { ProductSummary, CartItem, Category } from "../../types"
import UserProductDetail from "./user-product-detail"
import { fetchApi } from "../../services/base-api"


interface UserProductsProps {
  products: ProductSummary[]
  cart: CartItem[]
  setCart: (cart: CartItem[]) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  selectedProductId: string | null
  setSelectedProductId: (id: string | null) => void
}

export default function UserProducts({
  products,
  cart,
  setCart,
  selectedCategory,
  setSelectedCategory,
}: UserProductsProps) {
  const [apiProducts, setApiProducts] = useState<ProductSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  // Search states
  const [searchField, setSearchField] = useState<'keyword' | 'brand' | 'minPrice' | 'maxPrice'>('keyword')
  const [searchValue, setSearchValue] = useState('')
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProducts()
    loadCategories()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productsApi.getAll(0, 20)
      setApiProducts(response.content)
      setError(null)
      setIsSearchMode(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await fetchApi<Category[]>("/v1/categories")
      setCategories(data)
    } catch (err) {
      console.error("Failed to load categories:", err)
    }
  }

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      loadProducts()
      return
    }

    try {
      setLoading(true)
      const params: Record<string, string | number> = {}

      if (searchField === 'keyword') {
        params.keyword = searchValue
      } else if (searchField === 'brand') {
        params.brand = searchValue
      } else if (searchField === 'minPrice') {
        params.minPrice = parseFloat(searchValue)
      } else if (searchField === 'maxPrice') {
        params.maxPrice = parseFloat(searchValue)
      }

      const response = await productsApi.search(params)
      setApiProducts(response.content)
      setSearchQuery(searchValue)
      setIsSearchMode(true)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = async (categoryId: number | null) => {
    if (categoryId === null) {
      setSelectedCategory(null)
      loadProducts()
      return
    }

    try {
      setLoading(true)
      setSelectedCategory(String(categoryId))
      const response = await productsApi.search({ categoryId })
      setApiProducts(response.content)
      setIsSearchMode(false)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to filter products')
    } finally {
      setLoading(false)
    }
  }

  const displayProducts = apiProducts

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId)
  }

  const handleCloseDetail = () => {
    setSelectedProductId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-semibold mb-2">Shop Products</h2>
        <p className="text-muted-foreground">Browse and add items to your cart</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-destructive">Error: {error}</p>
          <button onClick={loadProducts} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Category Filter and Search */}
          <div className="mb-8 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Category Filter */}
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
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === String(cat.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="flex gap-2 w-full md:w-auto">
              <select
                value={searchField}
                onChange={(e) => setSearchField(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
              >
                <option value="keyword">Name</option>
                <option value="brand">Brand</option>
                <option value="minPrice">Min Price</option>
                <option value="maxPrice">Max Price</option>
              </select>
              <input
                type={searchField.includes('Price') ? 'number' : 'text'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={`Search by ${searchField}...`}
                className="px-4 py-2 border border-border rounded-lg text-sm bg-background flex-1 md:w-64"
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

          {/* Search Results Info */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                          e.stopPropagation()
                          handleProductClick(product.id)
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
                    <span className="text-lg font-semibold">{product.price.toLocaleString('vi-VN')}đ</span>
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

      {/* Product Detail Popup */}
      {selectedProductId && (
        <UserProductDetail
          productId={selectedProductId}
          onClose={handleCloseDetail}
          onAddToCart={() => {
            // Refresh cart
          }}
        />
      )}
    </div>
  )
}