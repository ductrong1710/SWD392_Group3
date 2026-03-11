"use client"

import { useState, useEffect } from "react"
import { Search, CheckCircle, AlertTriangle, Package, Truck, Clock, XCircle } from "lucide-react"
import { useToast } from "../../contexts/ToastContext"
import { orderApi, type OrderResponseDto } from "../../services/order-api"

// ← Bỏ import Order, OrderStatus từ types — dùng string trực tiếp
type TrackingStatus = "ALL" | "PREPARING" | "SHIPPING" | "DELIVERED" | "COMPLETED" | "NOT_RECEIVED" | "CANCELLED"

const STATUS_OPTIONS: { value: TrackingStatus; label: string }[] = [
  { value: "ALL",          label: "Tất cả" },
  { value: "PREPARING",    label: "Đang chuẩn bị" },
  { value: "SHIPPING",     label: "Đang giao" },
  { value: "DELIVERED",    label: "Đã giao tới" },
  { value: "COMPLETED",    label: "Hoàn thành" },
  { value: "NOT_RECEIVED", label: "Chưa nhận được" },
  { value: "CANCELLED",    label: "Đã huỷ" },
]

interface AdminOrdersProps {
  orders: OrderResponseDto[];
  setOrders: (orders: OrderResponseDto[]) => void;
}

export default function AdminOrders({ orders, setOrders }: AdminOrdersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TrackingStatus>("ALL")
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => { loadOrders() }, [])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const data = await orderApi.getAllOrders()
      setOrders(data)
    } catch (error) {
      toast.error("Loading failed", "Could not load orders")
    } finally {
      setIsLoading(false)
    }
  }

  // Admin cập nhật tracking (dùng PATCH /tracking như Staff)
  const updateTracking = async (orderId: number, newTracking: string) => {
    try {
      // Gọi API — nếu không throw = thành công dù response rỗng
      await orderApi.updateTracking(orderId, newTracking)

      // ← Update state local ngay, không cần đợi refetch
      setOrders(
        orders.map((o) =>
          o.orderId === orderId ? { ...o, tracking: newTracking } : o
        )
      )
      toast.success("Cập nhật thành công", `Đơn #${orderId} → ${newTracking}`)
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Unknown error"
      console.error("[updateTracking] error:", msg)
      toast.error("Lỗi", `Không thể cập nhật: ${msg}`)

      // ← Reload lại để sync với DB (vì DB đã đổi nhưng state chưa đổi)
      await loadOrders()
    }
  }

  const getTrackingColor = (tracking: string) => {
    switch (tracking) {
      case "PREPARING":    return "bg-yellow-100 text-yellow-800"
      case "SHIPPING":     return "bg-indigo-100 text-indigo-800"
      case "DELIVERED":    return "bg-green-100 text-green-800"
      case "COMPLETED":    return "bg-green-200 text-green-900 font-bold"
      case "NOT_RECEIVED": return "bg-orange-100 text-orange-800 font-bold"
      case "CANCELLED":    return "bg-red-100 text-red-800"
      default:             return "bg-gray-100 text-gray-800"
    }
  }

  const getTrackingLabel = (tracking: string) => {
    const found = STATUS_OPTIONS.find((s) => s.value === tracking)
    return found?.label ?? tracking
  }

  const stats = {
    total:       orders.length,
    preparing:   orders.filter((o) => o.tracking === "PREPARING").length,
    shipping:    orders.filter((o) => o.tracking === "SHIPPING").length,
    delivered:   orders.filter((o) => o.tracking === "DELIVERED").length,
    completed:   orders.filter((o) => o.tracking === "COMPLETED").length,
    notReceived: orders.filter((o) => o.tracking === "NOT_RECEIVED").length,
    cancelled:   orders.filter((o) => o.status === "CANCELLED").length,
  }

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderId.toString().includes(searchTerm) ||
      (o.shippingAddress
        ? `${o.shippingAddress.addressLine} ${o.shippingAddress.city}`
            .toLowerCase().includes(searchTerm.toLowerCase())
        : false)
    const matchStatus =
      statusFilter === "ALL" ? true :
      statusFilter === "CANCELLED" ? o.status === "CANCELLED" :
      o.tracking === statusFilter
    return matchSearch && matchStatus
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold">Quản lý đơn hàng</h2>
          <p className="text-muted-foreground mt-1">Tổng: {stats.total} đơn hàng</p>
        </div>
        <button onClick={loadOrders} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90">
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/50" onClick={() => setStatusFilter("ALL")}>
          <Package className="w-6 h-6 mx-auto mb-1 text-muted-foreground" />
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-xs text-muted-foreground">Tổng đơn</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center cursor-pointer hover:bg-secondary/50" onClick={() => setStatusFilter("DELIVERED")}>
          <Truck className="w-6 h-6 mx-auto mb-1 text-green-500" />
          <p className="text-2xl font-bold text-green-600">{stats.delivered}</p>
          <p className="text-xs text-muted-foreground">Đã giao tới</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center cursor-pointer hover:bg-green-100" onClick={() => setStatusFilter("COMPLETED")}>
          <CheckCircle className="w-6 h-6 mx-auto mb-1 text-green-600" />
          <p className="text-2xl font-bold text-green-700">{stats.completed}</p>
          <p className="text-xs text-green-700 font-medium">Hoàn thành</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center cursor-pointer hover:bg-orange-100" onClick={() => setStatusFilter("NOT_RECEIVED")}>
          <AlertTriangle className="w-6 h-6 mx-auto mb-1 text-orange-500" />
          <p className="text-2xl font-bold text-orange-600">{stats.notReceived}</p>
          <p className="text-xs text-orange-700 font-medium">Chưa nhận được ⚠️</p>
        </div>
      </div>

      {/* NOT_RECEIVED Alert */}
      {stats.notReceived > 0 && (
        <div className="bg-orange-50 border border-orange-300 rounded-lg px-4 py-3 flex items-center gap-3 text-orange-800 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <span>
            Có <strong>{stats.notReceived}</strong> đơn hàng khách báo <strong>chưa nhận được</strong>. Vui lòng kiểm tra!
          </span>
          <button onClick={() => setStatusFilter("NOT_RECEIVED")} className="ml-auto px-3 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700">
            Xem ngay
          </button>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2 flex-1">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc địa chỉ..."
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

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Mã đơn</th>
              <th className="px-4 py-3 text-left font-semibold">Khách hàng</th>
              <th className="px-4 py-3 text-left font-semibold">Tổng tiền</th>
              <th className="px-4 py-3 text-left font-semibold">Tracking</th>
              <th className="px-4 py-3 text-left font-semibold">Thanh toán</th>
              <th className="px-4 py-3 text-left font-semibold">Cập nhật tracking</th>
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
                <td className="px-4 py-3 font-semibold text-primary">#{order.orderId}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {order.shippingAddress
                    ? `${order.shippingAddress.fullName} - ${order.shippingAddress.city}`
                    : "N/A"}
                </td>
                <td className="px-4 py-3 font-medium">
                  {order.finalAmount?.toLocaleString("vi-VN")}₫
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${getTrackingColor(order.tracking)}`}>
                    {order.tracking === "NOT_RECEIVED" && "⚠️ "}
                    {getTrackingLabel(order.tracking)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${
                    order.status === "COMPLETED" ? "bg-green-100 text-green-800" :
                    order.status === "CANCELLED" ? "bg-red-100 text-red-800" :
                    "bg-yellow-100 text-yellow-800"
                  }`}>
                    {order.status === "AWAITING_PAYMENT" ? "Chờ TT" :
                     order.status === "COMPLETED" ? "Đã TT" :
                     order.status === "CANCELLED" ? "Đã huỷ" : order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {/* Admin chỉ update tracking nếu chưa COMPLETED/NOT_RECEIVED/CANCELLED */}
                  {!["COMPLETED", "NOT_RECEIVED", "CANCELLED"].includes(order.tracking) &&
                  order.status !== "CANCELLED" ? (
                    <select
                      value={order.tracking || ""}
                      onChange={(e) => updateTracking(order.orderId, e.target.value)}
                      className="text-xs border border-border rounded px-2 py-1 bg-background"
                    >
                      {/* 1. THÊM DÒNG NÀY ĐỂ FIX LỖI HIỂN THỊ ẢO */}
                      <option value="" disabled>-- Chọn trạng thái --</option>

                      {/* 2. GIỮ NGUYÊN ĐOẠN MAP DỮ LIỆU CŨ */}
                      {STATUS_OPTIONS
                        .filter((s) => !["ALL", "COMPLETED", "NOT_RECEIVED", "CANCELLED"].includes(s.value))
                        .map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">Không thể sửa</span>
                  )}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Không có đơn hàng nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}