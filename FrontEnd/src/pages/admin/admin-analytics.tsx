"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  sizes: string[];
  colors: string[];
  stock: Record<string, Record<string, number>>;
  description: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "pending" | "shipping" | "completed" | "cancelled";
  shippingAddress: string;
  paymentMethod: string;
  userId: string;
}

interface AdminAnalyticsProps {
  products: Product[];
  orders: Order[];
}

const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

const salesByCategory = [
  { category: "Women", sales: 2400, revenue: 24000 },
  { category: "Men", sales: 1398, revenue: 22100 },
  { category: "Accessories", sales: 1800, revenue: 18000 },
];

const monthlySales = [
  { month: "Jan", sales: 4000, revenue: 24000 },
  { month: "Feb", sales: 3000, revenue: 18000 },
  { month: "Mar", sales: 2000, revenue: 12000 },
  { month: "Apr", sales: 2780, revenue: 16700 },
  { month: "May", sales: 1890, revenue: 11300 },
  { month: "Jun", sales: 2390, revenue: 14400 },
];

export default function AdminAnalytics({
  products,
  orders,
}: AdminAnalyticsProps) {
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const bestSellingProduct = products.sort((a, b) => b.rating - a.rating)[0];

  const categoryBreakdown = products.reduce((acc, product) => {
    const existing = acc.find((c) => c.category === product.category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ category: product.category, count: 1 });
    }
    return acc;
  }, [] as Array<{ category: string; count: number }>);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-serif font-semibold">
          Analytics & Insights
        </h2>
        <p className="text-muted-foreground mt-1">
          Business performance and sales metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
          <p className="text-3xl font-bold text-primary">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-xs text-green-600 mt-2">↑ 12% from last period</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Avg Order Value</p>
          <p className="text-3xl font-bold text-primary">
            ${avgOrderValue.toFixed(2)}
          </p>
          <p className="text-xs text-green-600 mt-2">↑ 8% from last period</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
          <p className="text-3xl font-bold text-primary">{orders.length}</p>
          <p className="text-xs text-green-600 mt-2">↑ 15% from last period</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Trend */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Monthly Sales Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlySales}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis dataKey="month" stroke="var(--color-muted-foreground)" />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-primary)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesByCategory}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--color-border)"
              />
              <XAxis
                dataKey="category"
                stroke="var(--color-muted-foreground)"
              />
              <YAxis stroke="var(--color-muted-foreground)" />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="var(--color-accent)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Mix */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Product Mix</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                nameKey="category"
                dataKey="count"
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name} (${value})`}
                outerRadius={100}
                fill="#8884d8"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Insights */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-6">Top Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-secondary rounded">
              <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Best Seller</p>
                <p className="text-xs text-muted-foreground">
                  {bestSellingProduct?.name} (★ {bestSellingProduct?.rating})
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary rounded">
              <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Most Orders</p>
                <p className="text-xs text-muted-foreground">
                  {orders.filter((o) => o.status === "completed").length}{" "}
                  completed orders this period
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-secondary rounded">
              <TrendingUp className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-sm">Active Products</p>
                <p className="text-xs text-muted-foreground">
                  {products.length} products in catalog
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
