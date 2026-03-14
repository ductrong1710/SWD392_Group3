"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertTriangle,
  X,
} from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import { orderApi, type OrderResponse } from "../../services/order-api";

interface UserOrdersProps {
  orders?: OrderResponse[];
  setSelectedOrderId?: (id: string | null) => void;
}

export default function UserOrders({ setSelectedOrderId }: UserOrdersProps) {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingOrderId, setConfirmingOrderId] = useState<number | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
  open: boolean;
  orderId: number | null;
  action: "received" | "notReceived" | null;
  title: string;
  message: string;
  confirmText: string;
  confirmClassName: string;
}>({
  open: false,
  orderId: null,
  action: null,
  title: "",
  message: "",
  confirmText: "",
  confirmClassName: "",
});

  const toast = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderApi.getMyOrders();
      setOrders(data);
    } catch {
      toast.error("Loading failed", "Could not load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReceived = (orderId: number) => {
  setConfirmDialog({
    open: true,
    orderId,
    action: "received",
    title: "Confirm Delivery",
    message: "Do you confirm that you have received this order?",
    confirmText: "Yes, I received it",
    confirmClassName: "bg-green-600 hover:bg-green-700",
  });
};

const handleNotReceived = (orderId: number) => {
  setConfirmDialog({
    open: true,
    orderId,
    action: "notReceived",
    title: "Report Not Received",
    message: "Do you confirm that you have not received this order?",
    confirmText: "Yes, report it",
    confirmClassName: "bg-orange-500 hover:bg-orange-600",
  });
};

const handleConfirmAction = async () => {
  if (!confirmDialog.orderId || !confirmDialog.action) return;

  const orderId = confirmDialog.orderId;
  const action = confirmDialog.action;

  try {
    setConfirmingOrderId(orderId);

    if (action === "received") {
      await orderApi.confirmReceived(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, tracking: "COMPLETED" } : o
        )
      );
      toast.success("Success", "The order has been confirmed as completed.");
    } else {
      await orderApi.reportNotReceived(orderId);
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, tracking: "NOT_RECEIVED" } : o
        )
      );
      toast.warning("Recorded", "Your report has been received. We will review it soon.");
    }

    setConfirmDialog((prev) => ({ ...prev, open: false }));
  } catch {
    toast.error(
      "Error",
      action === "received"
        ? "Could not confirm the order. Please try again."
        : "Could not submit the report. Please try again."
    );
  } finally {
    setConfirmingOrderId(null);
  }
};

const closeConfirmDialog = () => {
  if (confirmingOrderId !== null) return;

  setConfirmDialog({
    open: false,
    orderId: null,
    action: null,
    title: "",
    message: "",
    confirmText: "",
    confirmClassName: "",
  });
};



  const getTrackingIcon = (tracking: string) => {
    switch (tracking) {
      case "PREPARING":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "SHIPPING":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "DELIVERED":
        return <Package className="w-5 h-5 text-green-500" />;
      case "COMPLETED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "NOT_RECEIVED":
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrackingColor = (tracking: string) => {
    switch (tracking) {
      case "PREPARING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "SHIPPING":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "COMPLETED":
        return "bg-green-200 text-green-900 border-green-300";
      case "NOT_RECEIVED":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrackingLabel = (tracking: string) => {
    switch (tracking) {
      case "PREPARING":
        return "Preparing";
      case "SHIPPING":
        return "Shipping";
      case "DELIVERED":
        return "Delivered";
      case "COMPLETED":
        return "Completed";
      case "NOT_RECEIVED":
        return "Not Received";
      default:
        return tracking || "Processing";
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "AWAITING_PAYMENT":
        return "Awaiting Payment";
      case "COMPLETED":
        return "Paid";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
        <p className="text-muted-foreground">
          Start shopping to place your first order.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif font-semibold">My Orders</h2>
        <button
          onClick={loadOrders}
          className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
        >
          Refresh
        </button>
      </div>

      {orders.map((order) => (
        <div key={order.orderId} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTrackingIcon(order.tracking)}
              <div>
                <p className="font-semibold text-lg">Order #{order.orderId}</p>
                <p className="text-sm text-muted-foreground">
                  {order.orderDate ? new Date(order.orderDate).toLocaleDateString("vi-VN") : ""}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {order.tracking && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTrackingColor(order.tracking)}`}>
                  {getTrackingLabel(order.tracking)}
                </span>
              )}
              <span className="px-2 py-0.5 rounded text-xs text-muted-foreground bg-secondary">
                {getPaymentStatusLabel(order.status)}
              </span>
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            {order.shippingAddress && (
              <p>
                <span className="font-medium text-foreground">Address:</span>{" "}
                {order.shippingAddress.addressLine}, {order.shippingAddress.city}
              </p>
            )}
            <p>
              <span className="font-medium text-foreground">Payment:</span>{" "}
              {order.paymentMethod}
            </p>
            <p>
              <span className="font-medium text-foreground">Total:</span>{" "}
              <span className="text-primary font-semibold text-base">
                ${Number(order.finalAmount ?? 0).toLocaleString("en-US")}
              </span>
            </p>
          </div>

          {order.items && order.items.length > 0 && (
            <div className="border-t border-border pt-3 space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-sm">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-12 h-12 rounded object-cover border border-border"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.productName}</p>
                    <p className="text-muted-foreground text-xs">
                      {item.variantInfo} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium shrink-0">
                    ${Number(item.itemTotal ?? 0).toLocaleString("en-US")}
                  </p>
                </div>
              ))}
            </div>
          )}

          {order.tracking === "DELIVERED" && (
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                This order has been delivered. Please confirm:
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleConfirmReceived(order.orderId)}
                  disabled={confirmingOrderId === order.orderId}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {confirmingOrderId === order.orderId ? "Processing..." : "Received"}
                </button>
                <button
                  onClick={() => handleNotReceived(order.orderId)}
                  disabled={confirmingOrderId === order.orderId}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {confirmingOrderId === order.orderId ? "Processing..." : "Not Received"}
                </button>
              </div>
            </div>
          )}

          {order.tracking === "COMPLETED" && (
            <div className="border-t border-border pt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              You have confirmed successful delivery
            </div>
          )}

          {order.tracking === "NOT_RECEIVED" && (
            <div className="border-t border-border pt-4 flex items-center gap-2 text-orange-600 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              Your report has been recorded. Admin is reviewing it.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
