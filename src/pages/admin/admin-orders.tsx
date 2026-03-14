"use client";

import { useState, useEffect } from "react";
import { Search, CheckCircle, AlertTriangle, Package, Truck } from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import { orderApi, type OrderResponse } from "../../services/order-api";

type TrackingStatus =
  | "ALL"
  | "PREPARING"
  | "SHIPPING"
  | "DELIVERED"
  | "COMPLETED"
  | "NOT_RECEIVED"
  | "CANCELLED";

const STATUS_OPTIONS: { value: TrackingStatus; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "PREPARING", label: "Preparing" },
  { value: "SHIPPING", label: "Shipping" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "COMPLETED", label: "Completed" },
  { value: "NOT_RECEIVED", label: "Not Received" },
  { value: "CANCELLED", label: "Cancelled" },
];

interface AdminOrdersProps {
  orders: OrderResponse[];
  setOrders: (orders: OrderResponse[]) => void;
}

export default function AdminOrders({ orders, setOrders }: AdminOrdersProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<TrackingStatus>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderApi.getAllOrders();
      setOrders(data);
    } catch {
      toast.error("Loading failed", "Could not load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const updateTracking = async (orderId: number, newTracking: string) => {
    try {
      await orderApi.updateTracking(orderId, newTracking);

      setOrders(
        orders.map((o) =>
          o.orderId === orderId ? { ...o, tracking: newTracking } : o
        )
      );

      toast.success("Updated successfully", `Order #${orderId} → ${newTracking}`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error";
      console.error("[updateTracking] error:", msg);
      toast.error("Error", `Unable to update: ${msg}`);
      await loadOrders();
    }
  };

  const getTrackingColor = (tracking: string) => {
    switch (tracking) {
      case "PREPARING":
        return "bg-yellow-100 text-yellow-800";
      case "SHIPPING":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-green-200 text-green-900 font-bold";
      case "NOT_RECEIVED":
        return "bg-orange-100 text-orange-800 font-bold";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTrackingLabel = (tracking: string) => {
    const found = STATUS_OPTIONS.find((s) => s.value === tracking);
    return found?.label ?? tracking;
  };

  const stats = {
    total: orders.length,
    preparing: orders.filter((o) => o.tracking === "PREPARING").length,
    shipping: orders.filter((o) => o.tracking === "SHIPPING").length,
    delivered: orders.filter((o) => o.tracking === "DELIVERED").length,
    completed: orders.filter((o) => o.tracking === "COMPLETED").length,
    notReceived: orders.filter((o) => o.tracking === "NOT_RECEIVED").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderId.toString().includes(searchTerm) ||
      (o.shippingAddress
        ? `${o.shippingAddress.fullName} ${o.shippingAddress.addressLine} ${o.shippingAddress.city}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : false);

    const matchStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "CANCELLED"
        ? o.status === "CANCELLED"
        : o.tracking === statusFilter;

    return matchSearch && matchStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold">Order Management</h2>
          <p className="text-muted-foreground mt-1">Total: {stats.total} orders</p>
        </div>
        <button
          onClick={loadOrders}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div
          className="bg-card border border-border rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/50"
          onClick={() => setStatusFilter("ALL")}
        >
          <Package className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Total Orders</p>
        </div>
        <div
          className="bg-card border border-border rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/50"
          onClick={() => setStatusFilter("DELIVERED")}
        >
          <Truck className="w-6 h-6 mx-auto mb-1 text-green-500" />
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          <p className="text-xs text-muted-foreground">Delivered</p>
        </div>
        <div
          className="bg-green-50 border border-green-200 rounded-lg p-4 text-center cursor-pointer hover:bg-green-100"
          onClick={() => setStatusFilter("COMPLETED")}
        >
          <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
          <p className="text-xs text-green-700 font-medium">Completed</p>
        </div>
        <div
          className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center cursor-pointer hover:bg-orange-100"
          onClick={() => setStatusFilter("NOT_RECEIVED")}
        >
          <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-orange-500" />
          <p className="text-2xl font-bold text-orange-600">{stats.notReceived}</p>
          <p className="text-xs text-orange-700 font-medium">Not Received</p>
        </div>
      </div>

      {stats.notReceived > 0 && (
        <div className="bg-orange-50 border border-orange-300 rounded-lg px-4 py-3 flex items-center gap-3 text-orange-800 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>
            There are <strong>{stats.notReceived}</strong> orders reported as <strong>not received</strong>.
            Please review them.
          </span>
          <button
            onClick={() => setStatusFilter("NOT_RECEIVED")}
            className="ml-auto px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
          >
            View Now
          </button>
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order ID or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TrackingStatus)}
          className="px-3 py-2 border border-border rounded-lg text-sm bg-background"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
              {s.value !== "ALL" && s.value !== "CANCELLED"
                ? ` (${orders.filter((o) => o.tracking === s.value).length})`
                : s.value === "CANCELLED"
                ? ` (${stats.cancelled})`
                : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Total Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Tracking</th>
              <th className="px-4 py-3 text-left font-semibold">Payment</th>
              <th className="px-4 py-3 text-left font-semibold">Update Tracking</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.orderId}
                className={`border-b border-border hover:bg-secondary/30 transition-colors ${
                  order.tracking === "NOT_RECEIVED" ? "bg-orange-50" : ""
                }`}
              >
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {order.shippingAddress
                    ? `${order.shippingAddress.fullName} - ${order.shippingAddress.city}`
                    : "N/A"}
                </td>
                <td className="px-4 py-3 font-medium">
                  ${Number(order.finalAmount ?? 0).toLocaleString("en-US")}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTrackingColor(order.tracking)}`}>
                    {order.tracking === "NOT_RECEIVED" && "⚠️ "}
                    {getTrackingLabel(order.tracking)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      order.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : order.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order.status === "AWAITING_PAYMENT"
                      ? "Awaiting Payment"
                      : order.status === "COMPLETED"
                      ? "Paid"
                      : order.status === "CANCELLED"
                      ? "Cancelled"
                      : order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {!["COMPLETED", "NOT_RECEIVED", "CANCELLED"].includes(order.tracking) &&
                  order.status !== "CANCELLED" ? (
                    <select
                      value={order.tracking || ""}
                      onChange={(e) => updateTracking(order.orderId, e.target.value)}
                      className="text-xs border border-border rounded px-2 py-1 bg-background"
                    >
                      <option value="" disabled>
                        -- Select status --
                      </option>
                      {STATUS_OPTIONS
                        .filter((s) => !["ALL", "COMPLETED", "NOT_RECEIVED", "CANCELLED"].includes(s.value))
                        .map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Locked</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
