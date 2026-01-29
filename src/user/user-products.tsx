"use client"

import { useState } from "react"
import { Heart, Eye, Plus, Minus } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  price: number
  rating: number
  reviews: number
  image: string
  images: string[]
  sizes: string[]
  colors: string[]
  stock: Record<string, Record<string, number>>
  description: string
}

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

interface UserProductsProps {
  products: Product[]
  cart: CartItem[]
  setCart: (cart: CartItem[]) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  selectedProductId: string | null
  setSelectedProductId: (id: string | null) => void
}

const COLOR_MAP: Record<string, string> = {
  White: "#f5f5f5",
  Black: "#1a1a1a",
  Blue: "#3b82f6",
  Navy: "#001f3f",
  "Dark Blue": "#1e40af",
  "Light Blue": "#93c5fd",
  Burgundy: "#800020",
  Gray: "#9ca3af",
  Beige: "#f5e6d3",
  Rose: "#f1c0d0",
  Camel: "#c19a6b",
  Tan: "#d2b48c",
  Brown: "#8b6f47",
  Gold: "#ffd700",
  Silver: "#c0c0c0",
  "Rose Gold": "#f4c2a0",
  Cream: "#fffdd0",
  Coral: "#ff7f50",
  Cognac: "#a94c1b",
  "Navy Blue": "#001f3f",
}

export default function UserProducts({
  products,
  cart,
  setCart,
  selectedCategory,
  setSelectedCategory,
}: UserProductsProps) {
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: { color: string; size: string; quantity: number }
  }>({})

  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products
  const categories = Array.from(new Set(products.map((p) => p.category)))

  const handleAddToCart = (product: Product) => {
    const options = selectedOptions[product.id] || { color: "", size: "", quantity: 1 }
    if (!options.color || !options.size) {
      alert("Please select color and size")
      return
    }

    const existingItem = cart.find(
      (item) => item.id === product.id && item.color === options.color && item.size === options.size,
    )

    if (existingItem) {
      setCart(
        cart.map((item) => (item === existingItem ? { ...item, quantity: item.quantity + options.quantity } : item)),
      )
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          color: options.color,
          size: options.size,
          quantity: options.quantity,
        },
      ])
    }

    setSelectedOptions({
      ...selectedOptions,
      [product.id]: { color: "", size: "", quantity: 1 },
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h2 className="text-3xl font-serif font-semibold mb-2">
          {selectedCategory ? `${selectedCategory} Collection` : "Shop Products"}
        </h2>
        <p className="text-muted-foreground">Browse and add items to your cart</p>
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
        {filteredProducts.map((product) => {
          const opts = selectedOptions[product.id] || {
            color: "",
            size: "",
            quantity: 1,
          }
          return (
            <div key={product.id} className="group">
              <div className="bg-secondary rounded-lg h-64 mb-4 flex items-center justify-center relative overflow-hidden">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                  <button className="p-2 bg-white rounded-full text-foreground hover:bg-secondary transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="p-2 bg-white rounded-full text-foreground hover:bg-secondary transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <h3 className="font-semibold mb-1">{product.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-muted-foreground">★ {product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>

              {/* Color Selection */}
              <div className="mb-3">
                <p className="text-xs font-medium text-muted-foreground mb-2">Color</p>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <div
                      key={color}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                        opts.color === color ? "border-primary scale-110" : "border-border"
                      }`}
                      title={color}
                      onClick={() =>
                        setSelectedOptions({
                          ...selectedOptions,
                          [product.id]: { ...opts, color },
                        })
                      }
                      style={{
                        backgroundColor: COLOR_MAP[color] || "#e5e7eb",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground mb-2">Size</p>
                <select
                  value={opts.size}
                  onChange={(e) =>
                    setSelectedOptions({
                      ...selectedOptions,
                      [product.id]: { ...opts, size: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-border rounded text-sm bg-background"
                >
                  <option value="">Select size</option>
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div className="mb-4 flex items-center gap-2">
                <button
                  onClick={() =>
                    opts.quantity > 1 &&
                    setSelectedOptions({
                      ...selectedOptions,
                      [product.id]: {
                        ...opts,
                        quantity: opts.quantity - 1,
                      },
                    })
                  }
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium w-8 text-center">{opts.quantity}</span>
                <button
                  onClick={() =>
                    setSelectedOptions({
                      ...selectedOptions,
                      [product.id]: {
                        ...opts,
                        quantity: opts.quantity + 1,
                      },
                    })
                  }
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-2">
                <span className="text-lg font-semibold">${product.price}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm font-medium flex-1"
                >
                  Add
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
