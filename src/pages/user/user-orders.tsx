"use client";

import { useState, useEffect } from "react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "../../contexts/ToastContext";
import { orderApi, type OrderResponseDto } from "../../services/order-api";

interface UserOrdersProps {
  orders?: OrderResponseDto[];
  setSelectedOrderId?: (id: string | null) => void;
}

export default function UserOrders({ setSelectedOrderId }: UserOrdersProps) {
  const [orders, setOrders] = useState<OrderResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmingOrderId, setConfirmingOrderId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderApi.getMyOrders();
      setOrders(data);
    } catch (error) {
      toast.error("Loading failed", "Could not load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReceived = async (orderId: number) => {
    if (!window.confirm("Xác nhận bạn đã nhận được hàng?")) return;
    try {
      setConfirmingOrderId(orderId);
      await orderApi.confirmReceived(orderId);
      // tracking → COMPLETED
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, tracking: "COMPLETED" } : o
        )
      );
      toast.success("Thành công", "Đơn hàng đã được xác nhận hoàn thành!");
    } catch (error) {
      toast.error("Lỗi", "Không thể xác nhận đơn hàng. Vui lòng thử lại.");
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const handleNotReceived = async (orderId: number) => {
    if (!window.confirm("Xác nhận bạn chưa nhận được hàng?")) return;
    try {
      setConfirmingOrderId(orderId);
      await orderApi.reportNotReceived(orderId);
      // tracking → NOT_RECEIVED
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, tracking: "NOT_RECEIVED" } : o
        )
      );
      toast.warning("Đã ghi nhận", "Chúng tôi sẽ xử lý và liên hệ bạn sớm!");
    } catch (error) {
      toast.error("Lỗi", "Không thể gửi báo cáo. Vui lòng thử lại.");
    } finally {
      setConfirmingOrderId(null);
    }
  };

  const getTrackingIcon = (tracking: string) => {
    switch (tracking) {
      case "PREPARING":    return <Clock className="w-5 h-5 text-yellow-500" />;
      case "SHIPPING":     return <Truck className="w-5 h-5 text-blue-500" />;
      case "DELIVERED":    return <Package className="w-5 h-5 text-green-500" />;
      case "COMPLETED":    return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "NOT_RECEIVED": return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:             return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTrackingColor = (tracking: string) => {
    switch (tracking) {
      case "PREPARING":    return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "SHIPPING":     return "bg-blue-100 text-blue-800 border-blue-200";
      case "DELIVERED":    return "bg-green-100 text-green-800 border-green-200";
      case "COMPLETED":    return "bg-green-200 text-green-900 border-green-300";
      case "NOT_RECEIVED": return "bg-orange-100 text-orange-800 border-orange-200";
      default:             return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTrackingLabel = (tracking: string) => {
    switch (tracking) {
      case "PREPARING":    return "Đang chuẩn bị";
      case "SHIPPING":     return "Đang giao hàng";
      case "DELIVERED":    return "Đã giao tới";
      case "COMPLETED":    return "Hoàn thành";
      case "NOT_RECEIVED": return "Chưa nhận được";
      default:             return tracking || "Đang xử lý";
    }
  };

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case "AWAITING_PAYMENT": return "Chờ thanh toán";
      case "COMPLETED":        return "Đã thanh toán";
      case "CANCELLED":        return "Đã huỷ";
      default:                 return status;
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
        <h3 className="text-xl font-semibold mb-2">Chưa có đơn hàng nào</h3>
        <p className="text-muted-foreground">Bắt đầu mua sắm để tạo đơn hàng đầu tiên!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif font-semibold">Đơn hàng của tôi</h2>
        <button
          onClick={loadOrders}
          className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-secondary transition-colors"
        >
          Làm mới
        </button>
      </div>

      {orders.map((order) => (
        <div key={order.orderId} className="bg-card border border-border rounded-xl p-6 space-y-4">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getTrackingIcon(order.tracking)}
              <div>
                <p className="font-semibold text-lg">Đơn hàng #{order.orderId}</p>
                <p className="text-sm text-muted-foreground">
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString("vi-VN")
                    : ""}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
              {/* Tracking badge */}
              {order.tracking && (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTrackingColor(order.tracking)}`}>
                  {getTrackingLabel(order.tracking)}
                </span>
              )}
              {/* Payment status badge */}
              <span className="px-2 py-0.5 rounded text-xs text-muted-foreground bg-secondary">
                {getPaymentStatusLabel(order.status)}
              </span>
            </div>
          </div>

          {/* Order Info */}
          <div className="text-sm text-muted-foreground space-y-1">
            {order.shippingAddress && (
              <p>
                <span className="font-medium text-foreground">Địa chỉ:</span>{" "}
                {order.shippingAddress.addressLine}, {order.shippingAddress.city}
              </p>
            )}
            <p>
              <span className="font-medium text-foreground">Thanh toán:</span>{" "}
              {order.paymentMethod}
            </p>
            <p>
              <span className="font-medium text-foreground">Tổng tiền:</span>{" "}
              <span className="text-primary font-semibold text-base">
                {order.finalAmount?.toLocaleString("vi-VN")}₫
              </span>
            </p>
          </div>

          {/* Items */}
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
                    <p className="text-muted-foreground text-xs">{item.variantInfo} × {item.quantity}</p>
                  </div>
                  <p className="font-medium shrink-0">
                    {item.itemTotal?.toLocaleString("vi-VN")}₫
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* ✅ Nút xác nhận - CHỈ hiện khi tracking = DELIVERED */}
          {order.tracking === "DELIVERED" && (
            <div className="border-t border-border pt-4">
              <p className="text-sm text-muted-foreground mb-3">
                Đơn hàng đã được giao tới. Vui lòng xác nhận:
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleConfirmReceived(order.orderId)}
                  disabled={confirmingOrderId === order.orderId}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  {confirmingOrderId === order.orderId ? "Đang xử lý..." : "Đã nhận hàng"}
                </button>
                <button
                  onClick={() => handleNotReceived(order.orderId)}
                  disabled={confirmingOrderId === order.orderId}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium text-sm disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {confirmingOrderId === order.orderId ? "Đang xử lý..." : "Chưa nhận được"}
                </button>
              </div>
            </div>
          )}

          {/* COMPLETED */}
          {order.tracking === "COMPLETED" && (
            <div className="border-t border-border pt-4 flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Bạn đã xác nhận nhận hàng thành công
            </div>
          )}

          {/* NOT_RECEIVED */}
          {order.tracking === "NOT_RECEIVED" && (
            <div className="border-t border-border pt-4 flex items-center gap-2 text-orange-600 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              Báo cáo của bạn đã được ghi nhận. Admin đang xem xét.
            </div>
          )}
        </div>
      ))}
    </div>
  );
}