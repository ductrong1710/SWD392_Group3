"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { ChevronRight } from "lucide-react";
import { checkoutApi } from "../../services/checkout-api";
import { useToast } from "../../contexts/ToastContext";
import type { CartItem, PageType } from "../../types";
import type { OrderResponseDto } from "../../services/order-api";

interface UserCheckoutProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  setOrders: (orders: OrderResponseDto[]) => void;  // ← đổi Order[] thành OrderResponseDto[]
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
}

export default function UserCheckout({
  cart,
  setCart,
  setOrders,
  setCurrentPage,
}: UserCheckoutProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    paymentMethod: "VNPAY" as "VNPAY",  // ← chỉ VNPAY
  });
  const toast = useToast();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10;
  const tax = total * 0.1;
  const grandTotal = total + shipping + tax;

  const handleSubmit = async () => {
    if (!formData.fullName || !formData.phone || !formData.addressLine || !formData.city) {
      toast.warning("Missing information", "Please fill in all required fields");
      return;
    }

    if (step === 1) {
      setStep(2);
      toast.info("Step 2", "Please confirm your order");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await checkoutApi.checkout({
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine: formData.addressLine,
          city: formData.city,
        },
        paymentMethod: "VNPAY",
      });

      // VNPAY: redirect sang payment gateway
      if (response.paymentUrl) {
        toast.info("Redirecting", "Redirecting to VNPay payment gateway...");
        window.location.href = response.paymentUrl;
        return;
      }

      // Fallback nếu không có paymentUrl
      setCart([]);
      toast.success("Order placed!", "Your order has been placed successfully");
      setCurrentPage("orders");
    } catch (error) {
      toast.error("Checkout failed", "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-serif font-semibold mb-8">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Steps */}
          <div className="flex items-center gap-4 mb-12">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
              step >= 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>
              1
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
              step >= 2 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>
              2
            </div>
          </div>

          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">Shipping Address</h3>
              <input
                type="text"
                placeholder="Full Name *"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="tel"
                placeholder="Phone Number *"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="text"
                placeholder="Address Line *"
                value={formData.addressLine}
                onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="text"
                placeholder="City *"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
            </div>
          )}

          {/* Step 2: Confirm + Payment */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">Confirm Order</h3>

              {/* Shipping summary */}
              <div className="bg-secondary rounded-lg p-4 space-y-2 text-sm">
                <p className="font-medium mb-2">Shipping Address</p>
                <p>{formData.fullName} — {formData.phone}</p>
                <p>{formData.addressLine}, {formData.city}</p>
              </div>

              {/* Payment method — chỉ VNPAY */}
              <div className="flex items-center gap-3 p-4 border border-primary bg-primary/5 rounded-lg">
                <input
                  type="radio"
                  name="payment"
                  value="VNPAY"
                  checked
                  readOnly
                  className="w-4 h-4"
                />
                <div>
                  <span className="font-medium">VNPay</span>
                  <p className="text-sm text-muted-foreground">
                    Pay securely via VNPay gateway
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-border rounded-lg hover:bg-secondary transition-colors font-medium"
              >
                Back
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
            >
              {isSubmitting
                ? "Processing..."
                : step === 1
                ? "Continue"
                : "Pay with VNPay"}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
            <h3 className="text-lg font-semibold mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
              {cart.map((item) => (
                <div key={item.productVariantId} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{item.productName}</span>
                    <span>×{item.quantity}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>{item.color} / {item.size}</span>
                    <span>{(item.price * item.quantity).toLocaleString("vi-VN")}₫</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{total.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shipping.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (10%)</span>
                <span>{tax.toLocaleString("vi-VN")}₫</span>
              </div>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>{grandTotal.toLocaleString("vi-VN")}₫</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}