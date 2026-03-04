"use client"

import { useState, useEffect } from "react"
import { Heart, Eye } from "lucide-react"
import type { ProductSummary } from "../../types"
import { fetchProducts, searchProducts } from "../../services/product-api"
import { useToast } from "../../contexts/ToastContext"

interface GuestProductsProps {
  products: ProductSummary[]
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  selectedProductId: string | null
  setSelectedProductId: (id: string | null) => void
  onCheckout: () => void
}

export default function GuestProducts({
  products,
  selectedCategory,
  setSelectedCategory,
  onCheckout,
}: GuestProductsProps) {
  const [apiProducts, setApiProducts] = useState<ProductSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categoryName, setCategoryName] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)

        if (selectedCategory) {
          // Filter by categoryId
          const response = await searchProducts({ categoryId: Number(selectedCategory) })
          setApiProducts(response.content)

          // Lấy tên category để hiển thị
          try {
            const { fetchApi } = await import("../../services/base-api")
            const categories = await fetchApi<{ id: number; name: string }[]>("/v1/categories")
            const found = categories.find((c) => String(c.id) === selectedCategory)
            setCategoryName(found?.name || null)
          } catch {
            setCategoryName(null)
          }
        } else {
          // Load all
          const response = await fetchProducts({ page: 0, size: 12, sort: 'id', order: 'asc' })
          setApiProducts(response.content)
          setCategoryName(null)
        }

        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
        toast.error("Loading failed", "Could not load products")
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [selectedCategory]) // ← Re-fetch khi category thay đổi

  // Map API products to display format
  const displayProducts = apiProducts.map((apiProduct) => ({
    id: apiProduct.id.toString(),
    name: apiProduct.name,
    price: apiProduct.price,
    brandName: apiProduct.brandName,
    thumbnailUrl: apiProduct.thumbnailUrl,
  }))

  const handleLoginRequired = () => {
    toast.info("Login required", "Please sign in to add items to cart")
    onCheckout()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-serif font-semibold mb-2">
              {categoryName ? `${categoryName} Collection` : "All Products"}
            </h2>
            <p className="text-muted-foreground">Browse our collection. Login to add items to cart.</p>
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
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4">Loading Products...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {displayProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No products found</p>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                >
                  View All Products
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayProducts.map((product) => (
                <div key={product.id} className="group">
                  <div className="bg-secondary rounded-lg h-64 mb-4 flex items-center justify-center relative overflow-hidden">
                    <img
                      src={product.thumbnailUrl || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={handleLoginRequired}
                        title="Login required"
                        className="p-2 bg-white rounded-full text-foreground hover:bg-secondary transition-colors"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleLoginRequired}
                        title="Login required"
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
                      onClick={handleLoginRequired}
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
    </div>
  )
}