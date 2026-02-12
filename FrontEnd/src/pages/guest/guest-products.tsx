"use client"

import { useState, useEffect } from "react"
import { Heart, Eye } from "lucide-react"
import { COLOR_MAP } from "../../constants/colors"  
import type { Product } from "../../types"
import { fetchProducts } from "../../services/product-api"
import type { ProductListItem } from "../../types/product"

interface GuestProductsProps {
  products: Product[]
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
  const [selectedColor, setSelectedColor] = useState<{ [key: string]: string }>({})
  const [apiProducts, setApiProducts] = useState<ProductListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true)
        const response = await fetchProducts({ page: 0, size: 12, sort: 'id', order: 'asc' })
        setApiProducts(response.content)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products')
        console.error('Error fetching products:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products
  const categories = Array.from(new Set(products.map((p) => p.category)))

  // Kết hợp data từ mock và API
  const mergedProducts = apiProducts.map((apiProduct) => {
    const mockProduct = products.find(p => p.id === apiProduct.id.toString())
    return {
      id: apiProduct.id.toString(),
      name: apiProduct.name,
      price: apiProduct.price,
      brandName: apiProduct.brandName,
      thumbnailUrl: apiProduct.thumbnailUrl,
      // Giữ lại các trường từ mock data nếu không có trong API
      colors: mockProduct?.colors || ['Black', 'White', 'Grey'],
      rating: mockProduct?.rating || 4.5,
      reviews: mockProduct?.reviews || 0,
      category: mockProduct?.category || 'All',
    }
  })

  const displayProducts = mergedProducts.length > 0 ? mergedProducts : filteredProducts.map(p => ({
    ...p,
    thumbnailUrl: p.image
  }))

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-semibold mb-2">
          {selectedCategory ? `${selectedCategory} Collection` : "All Products"}
        </h2>
        <p className="text-muted-foreground">Browse our collection. Login to add items to cart.</p>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Đang tải sản phẩm...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Lỗi: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Category Filter */}
          <div className="mb-8 flex gap-3 flex-wrap">
            <button
              onClick={() => setSelectedCategory(null)}
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
                onClick={() => setSelectedCategory(cat)}
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
                      onClick={onCheckout}
                      title="Login required"
                      className="p-2 bg-white rounded-full text-foreground hover:bg-secondary transition-colors"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={onCheckout}
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
                  <span className="text-lg font-semibold">{product.price.toLocaleString('vi-VN')}đ</span>
                  <button
                    onClick={onCheckout}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
