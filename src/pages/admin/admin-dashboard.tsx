"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, ShoppingBag, Users, DollarSign } from "lucide-react"
import type { ProductSummary, Order, Review, User, DashboardStats } from "../../types"
import { dashboardApi } from "../../services/dashboard-api"
import { useToast } from "../../contexts/ToastContext"

interface AdminDashboardProps {
  products: ProductSummary[];
  orders: Order[];
  reviews: Review[];
  users: User[];
}

export default function AdminDashboard({ products, orders, reviews, users }: AdminDashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    try {
      setIsLoading(true)
      const data = await dashboardApi.getStats()
      setStats(data)
    } catch (error) {
      toast.error("Dashboard error", "Failed to load dashboard statistics")
    } finally {
      setIsLoading(false)
    }
  }

  const totalRevenue = stats?.totalRevenue ?? 0
  const newOrders = stats?.newOrdersCount ?? 0
  const newUsers = stats?.newUsersCount ?? 0
  const avgOrderValue = orders.length > 0
    ? (orders.reduce((sum, o) => sum + o.finalAmount, 0) / orders.length).toFixed(2)
    : "0.00"

  const statCards = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      change: "+12%",
      icon: DollarSign,
      color: "bg-accent/10 text-accent",
    },
    {
      label: "New Orders",
      value: newOrders.toString(),
      change: "+8%",
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "New Users",
      value: newUsers.toString(),
      change: "+5%",
      icon: Users,
      color: "bg-green-100 text-green-600",
    },
    {
      label: "Avg Order Value",
      value: `$${avgOrderValue}`,
      change: "+3%",
      icon: TrendingUp,
      color: "bg-purple-100 text-purple-600",
    },
  ]

  // Revenue over time chart data
  const chartData = stats?.revenueOverTime?.map((item) => ({
    name: item.date,
    revenue: item.revenue,
  })) ?? []

  // Top selling products from API
  const topProducts = stats?.topSellingProducts ?? []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-2xl font-bold mb-2">{stat.value}</p>
              <p className="text-xs text-green-600 font-medium">{stat.change} from last week</p>
            </div>
          )
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Revenue Over Time</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="var(--color-primary)" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-10">No revenue data available</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.productId ?? index}
                className="flex items-center justify-between pb-4 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium">{product.productName}</p>
                  <p className="text-sm text-muted-foreground">{product.totalQuantitySold} sold</p>
                </div>
              </div>
            ))}
            {topProducts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No sales data available</p>
            )}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map((order) => (
              <div
                key={order.orderId}
                className="flex items-center justify-between pb-4 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium">Order #{order.orderId}</p>
                  <p className="text-sm text-muted-foreground">{order.orderDate}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${order.finalAmount.toFixed(2)}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    order.status === "COMPLETED" ? "bg-green-100 text-green-600" :
                    order.status === "CANCELLED" ? "bg-red-100 text-red-600" :
                    order.status === "SHIPPING" ? "bg-blue-100 text-blue-600" :
                    "bg-yellow-100 text-yellow-600"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}