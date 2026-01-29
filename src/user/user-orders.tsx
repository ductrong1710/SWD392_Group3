"use client";

import { Package, Truck, CheckCircle } from "lucide-react";
import type { CartItem, Order } from "../types/types";

interface UserOrdersProps {
  orders: Order[];
  setSelectedOrderId?: (id: string | null) => void;
}

export default function UserOrders({
  orders,
  setSelectedOrderId,
}: UserOrdersProps) {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Package className="w-5 h-5" />;
      case "shipped":
        return <Truck className="w-5 h-5" />;
      case "delivered":
        return <CheckCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-serif font-semibold mb-8">Your Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="font-semibold">
                  #{Math.floor(Math.abs(Number(order.id)) * 10000)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date</p>
                <p className="font-semibold">{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-semibold">${order.total.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="flex items-center gap-2 font-semibold">
                  {getStatusIcon(order.status)}
                  {getStatusLabel(order.status)}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-2">Shipping to:</p>
              <p className="text-sm">{order.shippingAddress}</p>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <p className="text-sm font-medium mb-2">Items:</p>
              <div className="space-y-1">
                {order.items.map((item, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {item.name} (x{item.quantity})
                  </p>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4 pt-4 border-t border-border">
              <button
                onClick={() =>
                  setSelectedOrderId && setSelectedOrderId(order.id)
                }
                className="px-4 py-2 border border-border rounded hover:bg-secondary transition-colors text-sm font-medium"
              >
                View Details
              </button>
              <button className="px-4 py-2 border border-border rounded hover:bg-secondary transition-colors text-sm font-medium">
                Track Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
