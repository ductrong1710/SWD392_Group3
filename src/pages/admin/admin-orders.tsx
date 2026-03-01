"use client"

import { useState, useEffect } from "react"
import { Eye, Search } from "lucide-react"
import type { Order, OrderStatus } from "../../types"
import { adminOrdersApi } from "../../services/order-api"
import { useToast } from "../../contexts/ToastContext"
interface AdminOrdersProps {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
}

export default function AdminOrders({ orders, setOrders }: AdminOrdersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setIsLoading(true)
      const data = await adminOrdersApi.getAllOrders()
      setOrders(data)
    } catch (error) {
      toast.error("Loading failed", "Could not load orders")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredOrders = orders.filter(
    (o) =>
      o.orderId.toString().includes(searchTerm.toLowerCase()) ||
      o.shippingAddressJson.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "DELIVERED":
        return "bg-green-100 text-green-700"
      case "SHIPPING":
        return "bg-blue-100 text-blue-700"
      case "PENDING":
      case "AWAITING_PAYMENT":
        return "bg-yellow-100 text-yellow-700"
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-100 text-red-700"
      case "PROCESSING":
        return "bg-purple-100 text-purple-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await adminOrdersApi.updateStatus(orderId, newStatus)
      setOrders(orders.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o)))
      toast.success("Status updated", `Order #${orderId} status changed to ${newStatus}`)
    } catch (error) {
      toast.error("Update failed", `Could not update order #${orderId} status`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-semibold">Order Management</h2>
        <p className="text-muted-foreground mt-1">View and manage all customer orders</p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-background border border-border rounded-lg px-3 py-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search orders by ID or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Order ID</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Items</th>
                <th className="px-6 py-3 text-left font-semibold">Total</th>
                <th className="px-6 py-3 text-left font-semibold">Payment</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId} className="border-b border-border hover:bg-secondary/50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-primary">#{order.orderId}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.orderDate}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.items.length}</td>
                  <td className="px-6 py-4 font-semibold">${order.finalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm">{order.paymentMethod}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.orderId, e.target.value as OrderStatus)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="AWAITING_PAYMENT">Awaiting Payment</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPING">Shipping</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="CANCELLED">Cancelled</option>
                      <option value="REFUNDED">Refunded</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded transition-colors text-sm font-medium">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}