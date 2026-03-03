"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, ShoppingBag, Users, DollarSign, Package, ArrowUpRight } from "lucide-react"
import type { ProductSummary, Order, Review, User, DashboardStats } from "../../types"
import { dashboardApi } from "../../services/dashboard-api"
import { useToast } from "../../contexts/ToastContext"

interface AdminDashboardProps {
  products: ProductSummary[]
  orders: Order[]
  reviews: Review[]
  users: User[]
}

/* ------------------------------------------------------------------ */
/*  Small reusable pieces – scoped to this page                       */
/* ------------------------------------------------------------------ */

interface StatCardProps {
  label: string
  value: string
  change: string
  icon: React.ElementType
  iconBg: string
}

function StatCard({ label, value, change, icon: Icon, iconBg }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground leading-tight mt-0.5">{value}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1 text-xs font-medium text-green-600">
        <ArrowUpRight className="w-3.5 h-3.5" />
        {change}
      </div>
    </div>
  )
}

function SectionCard({
  title,
  children,
  className = "",
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bg-card border border-border rounded-2xl shadow-sm ${className}`}>
      <div className="px-6 py-4 border-b border-border">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
    SHIPPING: "bg-blue-100 text-blue-700",
    PENDING: "bg-yellow-100 text-yellow-700",
  }

  const cls = styles[status] ?? styles.PENDING

  return (
    <span className={`inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cls}`}>
      {status}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatCurrency(amount: number): string {
  return amount.toLocaleString("vi-VN") + "₫"
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function AdminDashboard({
  products,
  orders,
  reviews,
  users,
}: AdminDashboardProps) {
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

  /* ---------- derived data ---------- */

  const totalRevenue = stats?.totalRevenue ?? 0
  const newOrders = stats?.newOrdersCount ?? 0
  const newUsers = stats?.newUsersCount ?? 0

  const statCards: StatCardProps[] = [
    {
      label: "Tổng doanh thu",
      value: formatCurrency(totalRevenue),
      change: `${newOrders} đơn trong 30 ngày`,
      icon: DollarSign,
      iconBg: "bg-primary/10 text-primary",
    },
    {
      label: "Đơn hàng mới (30 ngày)",
      value: newOrders.toString(),
      change: "Trong 30 ngày qua",
      icon: ShoppingBag,
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      label: "Người dùng mới (30 ngày)",
      value: newUsers.toString(),
      change: "Trong 30 ngày qua",
      icon: Users,
      iconBg: "bg-green-100 text-green-600",
    },
    {
      label: "Tổng sản phẩm",
      value: (stats?.topSellingProducts?.length ?? 0).toString(),
      change: "Sản phẩm đang bán chạy",
      icon: TrendingUp,
      iconBg: "bg-purple-100 text-purple-600",
    },
  ]

  const chartData =
    stats?.revenueOverTime?.map((item) => ({
      name: item.date,
      revenue: item.revenue,
    })) ?? []

  const topProducts = stats?.topSellingProducts ?? []

  /* ---------- loading state ---------- */

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">Đang tải dữ liệu…</p>
      </div>
    )
  }

  /* ---------- render ---------- */

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Tổng quan hiệu suất cửa hàng
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Revenue Chart */}
      <SectionCard title="Biểu đồ doanh thu theo ngày">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={chartData} barSize={32}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                stroke="var(--color-muted-foreground)"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--color-muted-foreground)"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => v.toLocaleString("vi-VN") + "₫"}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "0.75rem",
                  fontSize: 13,
                }}
                formatter={(value: number) => [formatCurrency(value), "Doanh thu"]}
                labelFormatter={(label: string) => `Ngày: ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: 13 }} />
              <Bar
                dataKey="revenue"
                fill="var(--color-primary)"
                name="Doanh thu"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <DollarSign className="w-10 h-10 mb-2 opacity-40" />
            <p className="text-sm">Chưa có dữ liệu doanh thu</p>
          </div>
        )}
      </SectionCard>

      {/* Bottom grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <SectionCard title="Sản phẩm bán chạy nhất">
          {topProducts.length > 0 ? (
            <ul className="divide-y divide-border">
              {topProducts.map((product, index) => (
                <li
                  key={product.productId}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {product.productName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Đã bán: {product.totalQuantitySold} sản phẩm
                    </p>
                  </div>
                  <Package className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <ShoppingBag className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">Chưa có dữ liệu bán hàng</p>
            </div>
          )}
        </SectionCard>

        {/* Recent Orders */}
        <SectionCard title="Đơn hàng gần đây">
          {orders.length > 0 ? (
            <ul className="divide-y divide-border">
              {orders.slice(0, 5).map((order) => (
                <li
                  key={order.orderId}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      Đơn hàng #{order.orderId}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.orderDate}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 ml-4">
                    <p className="text-sm font-semibold text-foreground">
                      {formatCurrency(order.finalAmount)}
                    </p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <ShoppingBag className="w-10 h-10 mb-2 opacity-40" />
              <p className="text-sm">Chưa có đơn hàng</p>
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  )
}