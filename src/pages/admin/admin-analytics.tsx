"use client"

import { useEffect, useState } from "react"
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts"
import { TrendingUp } from "lucide-react"
import type { ProductSummary, Order, DashboardStats } from "../../types"
import { dashboardApi } from "../../services/dashboard-api"
import { useToast } from "../../contexts/ToastContext"

interface AdminAnalyticsProps {
  products: ProductSummary[];
  orders: Order[];
}

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"]

export default function AdminAnalytics({ products, orders }: AdminAnalyticsProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const data = await dashboardApi.getStats()
      setStats(data)
    } catch (error) {
      toast.error("Analytics error", "Failed to load analytics data")
    } finally {
      setIsLoading(false)
    }
  }

  const totalRevenue = stats?.totalRevenue ?? 0
  const avgOrderValue = orders.length > 0
    ? orders.reduce((sum, o) => sum + o.finalAmount, 0) / orders.length
    : 0

  // Revenue over time chart data
  const revenueChartData = stats?.revenueOverTime?.map((item) => ({
    month: item.date,
    revenue: item.revenue,
  })) ?? []

  // Top selling products for pie chart
  const topProductsData = stats?.topSellingProducts?.map((item) => ({
    name: item.productName,
    value: item.totalQuantitySold,
  })) ?? []

  // Order status breakdown
  const orderStatusBreakdown = orders.reduce((acc, order) => {
    const existing = acc.find((s) => s.status === order.status)
    if (existing) {
      existing.count++
    } else {
      acc.push({ status: order.status, count: 1 })
    }
    return acc
  }, [] as Array<{ status: string; count: number }>)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-semibold">Analytics & Insights</h2>
        <p className="text-muted-foreground mt-1">Business performance and sales metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-green-600 mt-2">↑ 12% from last period</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Avg Order Value</p>
          <p className="text-3xl font-bold text-primary">${avgOrderValue.toFixed(2)}</p>
          <p className="text-xs text-green-600 mt-2">↑ 8% from last period</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-primary">{orders.length}</p>
          <p className="text-xs text-green-600 mt-2">↑ 15% from last period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Revenue Trend</h3>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No revenue data available</p>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Order Status Breakdown</h3>
          {orderStatusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={orderStatusBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="status" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="var(--color-accent)" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No order data available</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Top Selling Products</h3>
          {topProductsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topProductsData}
                  nameKey="name"
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={100}
                  fill="#8884d8"
                >
                  {topProductsData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-10">No sales data available</p>
          )}
        </div>

        {/* Top Insights */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Top Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-secondary rounded">
              <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Top Seller</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.topSellingProducts?.[0]?.productName ?? "N/A"} (
                  {stats?.topSellingProducts?.[0]?.totalQuantitySold ?? 0} sold)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary rounded">
              <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Completed Orders</p>
                <p className="text-xs text-muted-foreground">
                  {orders.filter((o) => o.status === "COMPLETED").length} completed orders this period
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary rounded">
              <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Active Products</p>
                <p className="text-xs text-muted-foreground">{products.length} products in catalog</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary rounded">
              <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">New Users</p>
                <p className="text-xs text-muted-foreground">
                  {stats?.newUsersCount ?? 0} new users this period
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}