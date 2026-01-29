"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { TrendingUp, ShoppingBag, Users, DollarSign } from "lucide-react"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

interface Order {
  id: string
  date: string
  items: CartItem[]
  total: number
  status: "pending" | "shipping" | "completed" | "cancelled"
  shippingAddress: string
  paymentMethod: string
  userId: string
}

interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title: string
  comment: string
  date: string
  flagged: boolean
}

interface User {
  id: string
  email: string
  name: string
  blocked: boolean
}

interface Product {
  id: string
  name: string
  category: string
  price: number
  rating: number
  reviews: number
  image: string
  images: string[]
  sizes: string[]
  colors: string[]
  stock: Record<string, Record<string, number>>
  description: string
}

interface AdminDashboardProps {
  products: Product[]
  orders: Order[]
  reviews: Review[]
  users: User[]
}

const chartData = [
  { name: "Mon", sales: 4000, orders: 240 },
  { name: "Tue", sales: 3000, orders: 221 },
  { name: "Wed", sales: 2000, orders: 229 },
  { name: "Thu", sales: 2780, orders: 200 },
  { name: "Fri", sales: 1890, orders: 229 },
  { name: "Sat", sales: 2390, orders: 200 },
  { name: "Sun", sales: 3490, orders: 320 },
]

export default function AdminDashboard({ products, orders, reviews, users }: AdminDashboardProps) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const activeUsers = users.filter((u) => !u.blocked).length
  const avgOrderValue = orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : "0.00"
  const lowStockProducts = products.filter((p) => {
    const totalStock = Object.values(p.stock).reduce((sum, colorStock) => {
      return sum + Object.values(colorStock).reduce((a, b) => a + b, 0)
    }, 0)
    return totalStock < 10
  })

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      change: "+12%",
      icon: DollarSign,
      color: "bg-accent/10 text-accent",
    },
    {
      label: "Total Orders",
      value: orders.length.toString(),
      change: "+8%",
      icon: ShoppingBag,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Customers",
      value: activeUsers.toString(),
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

  const topProducts = products
    .map((p) => ({
      id: p.id,
      name: p.name,
      sales: Math.floor(Math.random() * 300),
      revenue: (Math.random() * 50000).toFixed(2),
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
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

      {/* Charts */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Weekly Sales</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" />
            <YAxis stroke="var(--color-muted-foreground)" />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="var(--color-primary)" />
            <Bar dataKey="orders" fill="var(--color-accent)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Top Products</h3>
          <div className="space-y-4">
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between pb-4 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.sales} sales</p>
                </div>
                <p className="font-semibold">${product.revenue}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Low Stock Alert</h3>
          <div className="space-y-4">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between pb-4 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-xs text-destructive">Needs restock</p>
                </div>
                <span className="text-sm bg-destructive/10 text-destructive px-3 py-1 rounded">Low</span>
              </div>
            ))}
            {lowStockProducts.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">All products well stocked</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
