"use client";

import { Trash2, Minus, Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import type { CartItem, PageType } from "../../types";

interface UserCartProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
}

export default function UserCart({
  cart,
  setCart,
  setCurrentPage,
}: UserCartProps) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    if (quantity > 0) {
      const newCart = [...cart];
      newCart[index].quantity = quantity;
      setCart(newCart);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-serif font-semibold mb-4">Your Cart</h2>
        <p className="text-muted-foreground mb-8">Your cart is empty</p>
        <button
          onClick={() => setCurrentPage("products")}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-serif font-semibold mb-8">Your Cart</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-6 flex items-center gap-6"
            >
              <div className="w-24 h-24 bg-secondary rounded flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-muted-foreground text-center">
                  [Image]
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Color: {item.color} | Size: {item.size}
                </p>
                <p className="font-semibold">${item.price}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleQuantityChange(index, item.quantity - 1)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-sm font-medium w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(index, item.quantity + 1)}
                  className="p-1 hover:bg-secondary rounded"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleRemove(index)}
                className="p-2 hover:bg-destructive/10 rounded text-destructive transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
            <h3 className="text-lg font-semibold mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between font-semibold text-lg mb-6">
              <span>Total</span>
              <span>${(total + 10 + total * 0.1).toFixed(2)}</span>
            </div>
            <button
              onClick={() => setCurrentPage("checkout")}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium mb-3"
            >
              Proceed to Checkout
            </button>
            <button
              onClick={() => setCurrentPage("products")}
              className="w-full px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
