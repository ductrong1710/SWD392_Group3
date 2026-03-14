"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import type { ProductSummary } from "../../types";
import {
  dashboardApi,
  type DashboardSummaryResponse,
} from "../../services/dashboard-api";
import { orderApi, type OrderResponse } from "../../services/order-api";
import { useToast } from "../../contexts/ToastContext";

interface AdminAnalyticsProps {
  products: ProductSummary[];
  orders: OrderResponse[];
}

type Period = "week" | "month" | "quarter" | "year";

const PIE_COLORS = ["#0f766e", "#f59e0b", "#2563eb", "#dc2626", "#7c3aed", "#ea580c"];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatCompactCurrency(value: number) {
  if (!value) return "$0";
  if (Math.abs(value) >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (Math.abs(value) >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value}`;
}



function InsightCard({
  title,
  value,
  note,
  icon: Icon,
  iconClassName,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ElementType;
  iconClassName: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{note}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${iconClassName}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function AdminAnalytics({ products, orders: initialOrders }: AdminAnalyticsProps) {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>(initialOrders || []);
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("month");
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);

      const [summaryData, ordersData] = await Promise.all([
        dashboardApi.getSummary(),
        orderApi.getAllOrders(),
      ]);

      setSummary(summaryData);
      setOrders(ordersData);
    } catch {
      toast.error("Analytics error", "Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const salesMap = {
    week: summary?.salesThisWeek,
    month: summary?.salesThisMonth,
    quarter: summary?.salesThisQuarter,
    year: summary?.salesThisYear,
  };

  const activeSales = salesMap[selectedPeriod];

  const revenueChartData = useMemo(
    () =>
      (activeSales?.dataPoints ?? []).map((item) => ({
        label: item.timeLabel,
        revenue: Number(item.revenue ?? 0),
      })),
    [activeSales]
  );

  const topProducts =
    selectedPeriod === "year"
      ? summary?.topSellingProductsThisYear ?? []
      : summary?.topSellingProductsThisMonth ?? [];

  const topProductsPieData = topProducts.map((item) => ({
    name:
      item.productName.length > 20
        ? `${item.productName.slice(0, 20)}...`
        : item.productName,
    value: item.totalQuantitySold,
  }));

  const orderStatusData = useMemo(() => {
    const grouped = orders.reduce<Record<string, number>>((acc, order) => {
      const key = order.tracking || order.status || "UNKNOWN";
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(([status, count]) => ({
      status,
      count,
    }));
  }, [orders]);

  const averageOrderValue =
    orders.length > 0
      ? orders.reduce((sum, order) => sum + Number(order.finalAmount ?? 0), 0) /
        orders.length
      : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-serif font-semibold">Analytics & Insights</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Revenue, order behavior and product performance
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-sm">
          {(["week", "month", "quarter", "year"] as Period[]).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InsightCard
          title="Revenue"
          value={formatCurrency(Number(activeSales?.totalRevenue ?? 0))}
          note="Selected period revenue"
          icon={DollarSign}
          iconClassName="bg-primary/10 text-primary"
        />
        <InsightCard
          title="Growth"
          value={`${Number(activeSales?.percentageChange ?? 0).toFixed(1)}%`}
          note="Compared with previous period"
          icon={TrendingUp}
          iconClassName="bg-emerald-100 text-emerald-700"
        />
        <InsightCard
          title="Avg Order Value"
          value={formatCurrency(averageOrderValue)}
          note=""
          icon={ShoppingBag}
          iconClassName="bg-amber-100 text-amber-700"
        />
        <InsightCard
          title="Catalog Size"
          value={products.length.toLocaleString("vi-VN")}
          note="Products currently in catalog"
          icon={Package}
          iconClassName="bg-sky-100 text-sky-700"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <SectionCard title="Revenue Trend">
          {revenueChartData.length > 0 ? (
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="analyticsRevenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#e7e5e4" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#78716c" }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#78716c" }}
                    tickFormatter={(value) => formatCompactCurrency(Number(value))}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e7e5e4",
                      background: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0f766e"
                    strokeWidth={3}
                    fill="url(#analyticsRevenueFill)"
                    dot={{ r: 3, fill: "#ffffff", stroke: "#0f766e", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No revenue data available
            </div>
          )}
        </SectionCard>

        <SectionCard title="Order Status Breakdown">
          {orderStatusData.length > 0 ? (
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderStatusData} barSize={28}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e7e5e4" />
                  <XAxis dataKey="status" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#78716c" }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#78716c" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e7e5e4",
                      background: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                  />
                  <Bar dataKey="count" radius={[10, 10, 0, 0]} fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No order data available
            </div>
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard title="Top Selling Products">
          {topProductsPieData.length > 0 ? (
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topProductsPieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={68}
                    outerRadius={108}
                    paddingAngle={4}
                  >
                    {topProductsPieData.map((_, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e7e5e4",
                      background: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-16 text-center text-sm text-muted-foreground">
              No top-selling product data
            </div>
          )}
        </SectionCard>

        <SectionCard title="Quick Insights">
          <div className="space-y-4">
            <div className="rounded-2xl bg-background p-4">
              <div className="flex items-start gap-3">
                <Activity className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Best Seller</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {topProducts[0]?.productName ?? "N/A"} · {topProducts[0]?.totalQuantitySold ?? 0} sold
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-background p-4">
              <div className="flex items-start gap-3">
                <ShoppingBag className="mt-0.5 h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Orders Count</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {orders.length.toLocaleString("vi-VN")} orders from admin orders API
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-background p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="mt-0.5 h-5 w-5 text-emerald-600" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Previous Revenue</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatCurrency(Number(activeSales?.previousPeriodRevenue ?? 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-background p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="mt-0.5 h-5 w-5 text-sky-600" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Growth Trend</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {Number(activeSales?.percentageChange ?? 0).toFixed(1)}% versus previous period
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
