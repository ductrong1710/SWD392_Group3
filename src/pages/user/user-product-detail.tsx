"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Heart, Minus, Plus, Star, ShoppingCart } from "lucide-react";
import { productsApi, cartApi, ProductResponse, ProductVariant } from "../../services/api";
import { COLOR_MAP } from "../../constants/colors";

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
  onAddToCart: () => void;
}

export default function UserProductDetail({ productId, onBack, onAddToCart }: ProductDetailProps) {
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const data = await productsApi.getById(productId);
      setProduct(data);
      // Set default selections
      if (data.variants.length > 0) {
        const colors = [...new Set(data.variants.map((v) => v.color))];
        const sizes = [...new Set(data.variants.map((v) => v.size))];
        if (colors.length > 0) setSelectedColor(colors[0]);
        if (sizes.length > 0) setSelectedSize(sizes[0]);
      }
    } catch (err) {
      setError("Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };

  const getSelectedVariant = (): ProductVariant | undefined => {
    return product?.variants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  };

  const handleAddToCart = async () => {
    const variant = getSelectedVariant();
    if (!variant) {
      alert("Please select color and size");
      return;
    }

    setIsAddingToCart(true);
    try {
      await cartApi.addItem({
        productVariantId: variant.id,
        quantity,
      });
      onAddToCart();
      alert("Added to cart!");
    } catch (err) {
      alert("Failed to add to cart. Please login first.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <p className="text-destructive mb-4">{error || "Product not found"}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  const colors = [...new Set(product.variants.map((v) => v.color))];
  const sizes = [...new Set(product.variants.map((v) => v.size))];
  const selectedVariant = getSelectedVariant();
  const price = selectedVariant?.priceOverride || product.basePrice;
  const stock = selectedVariant?.stockQuantity || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="bg-secondary rounded-lg aspect-square flex items-center justify-center overflow-hidden">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-muted-foreground">No Image</span>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className="mb-2">
            <span className="text-sm text-muted-foreground">{product.brandName}</span>
          </div>
          <h1 className="text-3xl font-serif font-bold mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= product.rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              ({product.reviewCount} reviews)
            </span>
          </div>

          {/* Price */}
          <p className="text-3xl font-bold mb-6">${price.toFixed(2)}</p>

          {/* Description */}
          <p className="text-muted-foreground mb-8">{product.description}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-3">Color: {selectedColor}</p>
            <div className="flex gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    selectedColor === color
                      ? "border-primary scale-110"
                      : "border-border hover:border-primary/50"
                  }`}
                  style={{
                    backgroundColor: COLOR_MAP[color] || "#e5e7eb",
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium mb-3">Size</p>
            <div className="flex gap-3 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded-lg font-medium transition-colors ${
                    selectedSize === size
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Info */}
          <p className={`text-sm mb-6 ${stock > 0 ? "text-green-600" : "text-destructive"}`}>
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </p>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-8">
            <p className="text-sm font-medium">Quantity</p>
            <div className="flex items-center gap-2 border border-border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 hover:bg-secondary transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                className="p-2 hover:bg-secondary transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              disabled={stock === 0 || isAddingToCart}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <ShoppingCart className="w-5 h-5" />
              {isAddingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button className="p-3 border border-border rounded-lg hover:bg-secondary transition-colors">
              <Heart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}