"use client"

import { useState, useEffect } from "react"
import { Heart, Eye, Search } from "lucide-react"
import { fetchProducts } from "../../services/product-api"
import { searchProducts } from "../../services/productsearch-api"
import type { ProductListItem } from "../../types/product"
import type { Product, CartItem } from "../../types"
import UserProductDetail from "./user-product-detail"

interface UserProductsProps {
  products: Product[]
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
  const [apiProducts, setApiProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  
  // Search states
  const [isSearchMode, setIsSearchMode] = useState(false)
  const [searchField, setSearchField] = useState<'keyword' | 'categoryId' | 'brand' | 'minPrice' | 'maxPrice'>('keyword')
  const [searchValue, setSearchValue] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await fetchProducts({ page: 0, size: 12, sort: 'id', order: 'asc' })
      setApiProducts(response.content)
      setError(null)
      setIsSearchMode(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      loadProducts()
      return
    }

    try {
      setLoading(true)
      const searchParams: any = {}
      
      if (searchField === 'keyword') {
        searchParams.keyword = searchValue
      } else if (searchField === 'categoryId') {
        searchParams.categoryId = parseInt(searchValue)
      } else if (searchField === 'brand') {
        searchParams.brand = searchValue
      } else if (searchField === 'minPrice') {
        searchParams.minPrice = parseFloat(searchValue)
      } else if (searchField === 'maxPrice') {
        searchParams.maxPrice = parseFloat(searchValue)
      }

      const response = await searchProducts(searchParams)
      setApiProducts(response.content)
      setSearchQuery(searchValue)
      setIsSearchMode(true)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search products')
      console.error('Error searching products:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (category: string | null) => {
    setSelectedCategory(category)
    if (category === null) {
      // Reset to original product list
      setSearchValue('')
      setSearchQuery('')
      loadProducts()
    }
  }

  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products
  const categories = Array.from(new Set(products.map((p) => p.category)))

  // Merge API data with mock data
  const displayProducts = apiProducts.length > 0 ? apiProducts : []

  const handleProductClick = (productId: number) => {
    setSelectedProductId(productId)
  }

  const handleCloseDetail = () => {
    setSelectedProductId(null)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-semibold mb-2">
          {selectedCategory ? `${selectedCategory} Collection` : "Shop Products"}
        </h2>
        <p className="text-muted-foreground">Browse and add items to your cart</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Category Filter and Search Bar */}
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
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
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
                <option value="categoryId">Category ID</option>
                <option value="brand">Brand</option>
                <option value="minPrice">Min Price</option>
                <option value="maxPrice">Max Price</option>
              </select>
              <input
                type={searchField.includes('Price') || searchField === 'categoryId' ? 'number' : 'text'}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
              {displayProducts.length > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Found {displayProducts.length} product(s) for "{searchQuery}"
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No products found for "{searchQuery}"
                </p>
              )}
            </div>
          )}

          {displayProducts.length === 0 && isSearchMode ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProducts.map((product) => (
              <div key={product.id} className="group">
                <div 
                  onClick={() => handleProductClick(product.id)}
                  className="bg-secondary rounded-lg h-64 mb-4 flex items-center justify-center relative overflow-hidden cursor-pointer"
                >
                  <img
                    src={product.thumbnailUrl || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
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
            // Refresh cart or update UI
          }}
        />
      )}
    </div>
  )
}
