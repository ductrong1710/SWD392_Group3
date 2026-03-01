"use client";

import { useState, useEffect } from "react";
import { Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { ordersApi } from "../../services/order-api";
import { useToast } from "../../contexts/ToastContext";
import type { Order } from "../../types";

interface UserOrdersProps {
  orders: Order[];
  setSelectedOrderId?: (id: string | null) => void;
}

export default function UserOrders({
  orders: propOrders,
  setSelectedOrderId,
}: UserOrdersProps) {
  const [orders, setOrders] = useState<Order[]>(propOrders);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await ordersApi.getMyOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Failed to load orders", "Please try again later");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
      case "AWAITING_PAYMENT":
        return <Clock className="w-5 h-5" />;
      case "PROCESSING":
        return <Package className="w-5 h-5" />;
      case "SHIPPING":
        return <Truck className="w-5 h-5" />;
      case "DELIVERED":
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5" />;
      case "CANCELLED":
      case "REFUNDED":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
        return "text-green-600";
      case "SHIPPING":
        return "text-blue-600";
      case "PENDING":
      case "AWAITING_PAYMENT":
        return "text-yellow-600";
      case "CANCELLED":
      case "REFUNDED":
        return "text-red-600";
      case "PROCESSING":
        return "text-purple-600";
      default:
        return "text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-3xl font-serif font-semibold mb-4">Your Orders</h2>
        <p className="text-muted-foreground">
          You haven't placed any orders yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-serif font-semibold mb-8">Your Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-semibold text-primary">#{order.orderId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">{order.orderDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold">${order.finalAmount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className={`flex items-center gap-2 font-semibold ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  {order.status}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-1">Payment: <span className="text-foreground font-medium">{order.paymentMethod}</span></p>
            </div>

            {/* Order Items */}
            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm font-medium mb-2">Items:</p>
              <div className="space-y-2">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.productName} className="w-10 h-10 rounded object-cover" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-muted-foreground text-xs">
                        {item.color} / {item.size} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">${(item.priceAtPurchase * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Breakdown */}
            {order.discountAmount > 0 && (
              <div className="border-t border-border pt-4 mt-4 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-${order.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Final</span>
                  <span>${order.finalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4 pt-4 border-t border-border">
              <button
                onClick={() => setSelectedOrderId?.(String(order.orderId))}
                className="px-4 py-2 border border-border rounded hover:bg-secondary transition-colors text-sm font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}