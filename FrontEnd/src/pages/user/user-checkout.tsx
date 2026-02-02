"use client";

import { useState, Dispatch, SetStateAction } from "react";
import { ChevronRight } from "lucide-react";
import type { CartItem, Order, PageType } from "../../types";

interface UserCheckoutProps {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  setOrders: (orders: Order[]) => void;
  setCurrentPage: Dispatch<SetStateAction<PageType>>;
}

const VIETNAMESE_PROVINCES = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Hải Phòng",
  "Cần Thơ",
];
const DISTRICTS = ["Quận 1", "Quận 2", "Quận 3", "Quận 4"];
const WARDS = ["Phường 1", "Phường 2", "Phường 3", "Phường 4"];

export default function UserCheckout({
  cart,
  setCart,
  setOrders,
  setCurrentPage,
}: UserCheckoutProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    paymentMethod: "vnpay",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10;
  const tax = total * 0.1;
  const grandTotal = total + shipping + tax;

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.province ||
      !formData.district ||
      !formData.ward ||
      !formData.address
    ) {
      alert("Please fill all fields");
      return;
    }

    if (step === 1) {
      setStep(2);
      return;
    }

    const order: Order = {
      id: String(Math.random()),
      date: new Date().toLocaleDateString(),
      items: cart,
      total: grandTotal,
      status: "pending",
      userId: "",
      shippingAddress: `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.province}`,
      paymentMethod: formData.paymentMethod,
    };

    setOrders([order]);
    setCart([]);
    setCurrentPage("orders");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-serif font-semibold mb-8">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          {/* Steps */}
          <div className="flex items-center gap-4 mb-12">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                step >= 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              1
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                step >= 2
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              2
            </div>
          </div>

          {/* Step 1: Shipping Address */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">Shipping Address</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-border rounded-lg bg-background"
              />

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.province}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      province: e.target.value,
                      district: "",
                      ward: "",
                    })
                  }
                  className="px-4 py-2 border border-border rounded-lg bg-background"
                >
                  <option value="">Province</option>
                  {VIETNAMESE_PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      district: e.target.value,
                      ward: "",
                    })
                  }
                  disabled={!formData.province}
                  className="px-4 py-2 border border-border rounded-lg bg-background disabled:opacity-50"
                >
                  <option value="">District</option>
                  {formData.province &&
                    DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <select
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({ ...formData, ward: e.target.value })
                  }
                  disabled={!formData.district}
                  className="px-4 py-2 border border-border rounded-lg bg-background disabled:opacity-50"
                >
                  <option value="">Ward</option>
                  {formData.district &&
                    WARDS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                </select>
                <input
                  type="text"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="px-4 py-2 border border-border rounded-lg bg-background"
                />
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-6">Payment Method</h3>
              {["vnpay", "momo", "cod"].map((method) => (
                <label
                  key={method}
                  className="flex items-center gap-3 p-4 border border-border rounded-lg cursor-pointer hover:bg-secondary transition-colors"
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethod: e.target.value,
                      })
                    }
                    className="w-4 h-4"
                  />
                  <span className="font-medium">
                    {method === "vnpay"
                      ? "VNPay"
                      : method === "momo"
                      ? "MoMo"
                      : "Cash on Delivery"}
                  </span>
                </label>
              ))}
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
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              {step === 1 ? "Continue to Payment" : "Place Order"}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
            <h3 className="text-lg font-semibold mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
              {cart.map((item, i) => (
                <div key={i} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{item.name}</span>
                    <span>×{item.quantity}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground text-xs">
                    <span>
                      {item.color} / {item.size}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-3 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
