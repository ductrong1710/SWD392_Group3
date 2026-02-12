"use client";

import { useState, useEffect } from "react";
import { X, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { fetchProductDetail } from "../../services/productdetail-api";
import { COLOR_MAP } from "../../constants/colors";
import type { ProductDetail, ProductVariant } from "../../types/product-detail";

interface ProductDetailProps {
  productId: number | null;
  onClose: () => void;
  onAddToCart?: () => void;
}

export default function UserProductDetail({ productId, onClose, onAddToCart }: ProductDetailProps) {
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    if (!productId) return;
    
    try {
      setIsLoading(true);
      const data = await fetchProductDetail(productId);
      setProduct(data);
      // Set default selections
      if (data.productVariants.length > 0) {
        const colors = [...new Set(data.productVariants.map((v) => v.color))];
        if (colors.length > 0) {
          const firstColor = colors[0];
          setSelectedColor(firstColor);
          // Get available sizes for first color
          const sizesForColor = data.productVariants
            .filter((v) => v.color === firstColor)
            .map((v) => v.size);
          if (sizesForColor.length > 0) {
            setSelectedSize(sizesForColor[0]);
          }
        }
      }
      setError("");
    } catch (err) {
      setError("Failed to load product");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get available sizes for selected color
  const getAvailableSizes = (): string[] => {
    if (!product) return [];
    return product.productVariants
      .filter((v) => v.color === selectedColor)
      .map((v) => v.size);
  };

  // Update size when color changes
  useEffect(() => {
    if (product && selectedColor) {
      const availableSizes = getAvailableSizes();
      if (availableSizes.length > 0) {
        // If current size is not available for new color, select first available
        if (!availableSizes.includes(selectedSize)) {
          setSelectedSize(availableSizes[0]);
        }
      }
    }
  }, [selectedColor, product]);

  const getSelectedVariant = (): ProductVariant | undefined => {
    return product?.productVariants.find(
      (v) => v.color === selectedColor && v.size === selectedSize
    );
  };

  const handleAddToCart = async () => {
    const variant = getSelectedVariant();
    if (!variant) {
      alert("Please select color and size");
      return;
    }

    if (variant.stockQuantity < quantity) {
      alert("Not enough stock");
      return;
    }

    // TODO: Integrate with cart API
    alert(`Added ${quantity} item(s) to cart!`);
    onAddToCart?.();
    onClose();
  };

  if (!productId) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-pulse">Loading product...</div>
          </div>
        ) : error || !product ? (
          <div className="p-12 text-center">
            <p className="text-destructive mb-4">{error || "Product not found"}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Close
            </button>
          </div>
        ) : !product.isActive ? (
          <div className="p-12 text-center">
            <p className="text-destructive mb-4">Product is currently unavailable</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Close
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="bg-secondary rounded-lg aspect-square flex items-center justify-center overflow-hidden mb-4">
                {product.productImages.length > 0 && product.productImages[0].imageUrl ? (
                  <img
                    src={product.productImages.find(img => img.isThumbnail)?.imageUrl || product.productImages[0].imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground">No Image</span>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.productImages.slice(0, 4).map((img) => (
                    <div key={img.id} className="bg-secondary rounded aspect-square overflow-hidden">
                      <img
                        src={img.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-75 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-2">
                <span className="text-sm text-muted-foreground">{product.brandName}</span>
              </div>
              <h1 className="text-2xl font-serif font-bold mb-4">{product.name}</h1>

              {/* Price */}
              <p className="text-2xl font-bold mb-4">
                {(getSelectedVariant()?.priceOverride || product.basePrice).toLocaleString('vi-VN')}đ
              </p>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-6">{product.description}</p>

              {/* Color Selection */}
              {product.productVariants.length > 0 && (
                <>
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Color</p>
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background"
                    >
                      {[...new Set(product.productVariants.map(v => v.color))].map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size Selection */}
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Size</p>
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background"
                    >
                      {getAvailableSizes().map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Stock Info */}
              {getSelectedVariant() && (
                <p className={`text-sm mb-4 ${getSelectedVariant()!.stockQuantity > 0 ? "text-green-600" : "text-destructive"}`}>
                  {getSelectedVariant()!.stockQuantity > 0
                    ? `${getSelectedVariant()!.stockQuantity} in stock`
                    : "Out of stock"}
                </p>
              )}

              {/* Quantity */}
              <div className="flex items-center gap-4 mb-6">
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
                    onClick={() => setQuantity(Math.min(getSelectedVariant()?.stockQuantity || 999, quantity + 1))}
                    className="p-2 hover:bg-secondary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={(getSelectedVariant()?.stockQuantity || 0) === 0 || isAddingToCart}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </button>
                <button className="p-2 border border-border rounded-lg hover:bg-secondary transition-colors">
                  <Heart className="w-4 h-4" />
                </button>
              </div>

              {/* Category */}
              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Category: <span className="text-foreground">{product.category.name}</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}