"use client"

import { useState } from "react"
import { Heart, Eye } from "lucide-react"
import { COLOR_MAP } from "../../constants/colors"  
import type { Product } from "../../types"           

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

  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products
  const categories = Array.from(new Set(products.map((p) => p.category)))

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-semibold mb-2">
          {selectedCategory ? `${selectedCategory} Collection` : "All Products"}
        </h2>
        <p className="text-muted-foreground">Browse our collection. Login to add items to cart.</p>
      </div>

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
        {filteredProducts.map((product) => (
          <div key={product.id} className="group">
            <div className="bg-secondary rounded-lg h-64 mb-4 flex items-center justify-center relative overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
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
              <span className="text-sm text-muted-foreground">★ {product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.reviews})</span>
            </div>

            <div className="flex gap-2 mb-4">
              {product.colors.map((color) => (
                <div
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                    selectedColor[product.id] === color ? "border-primary scale-110" : "border-border"
                  }`}
                  title={color}
                  onClick={() => setSelectedColor({ ...selectedColor, [product.id]: color })}
                  style={{
                    backgroundColor: COLOR_MAP[color] || "#e5e7eb",
                  }}
                />
              ))}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">${product.price}</span>
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
    </div>
  )
}
