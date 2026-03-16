"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import {
  ArrowUpRight,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ProductSummary, Review } from "../../types";
import type { UserDto } from "../../services/user-api";
import {
  dashboardApi,
  type DashboardSummaryResponse,
  type ProductPerformanceResponse,
  type SalesPeriodResponse,
} from "../../services/dashboard-api";
import { orderApi, type OrderResponse } from "../../services/order-api";
import { useToast } from "../../contexts/ToastContext";

interface AdminDashboardProps {
  products: ProductSummary[];
  orders: OrderResponse[];
  reviews: Review[];
  users: UserDto[];
}

type DashboardPeriod = "day" | "week" | "month" | "quarter" | "year";

interface StatCardProps {
  label: string;
  value: string;
  subtext: string;
  icon: React.ElementType;
  iconClassName: string;
}

function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  iconClassName,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold leading-tight text-foreground">
            {value}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{subtext}</p>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClassName}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  actions,
  children,
}: {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        {actions}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 text-center">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function OrderStatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    COMPLETED: "bg-emerald-100 text-emerald-700",
    DELIVERED: "bg-teal-100 text-teal-700",
    SHIPPING: "bg-sky-100 text-sky-700",
    PREPARING: "bg-amber-100 text-amber-700",
    CANCELLED: "bg-rose-100 text-rose-700",
    NOT_RECEIVED: "bg-slate-200 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        styles[value] ?? "bg-secondary text-foreground"
      }`}
    >
      {value}
    </span>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatCompactCurrency(value: number) {
  if (!value) return "$0";

  if (Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }

  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }

  return `$${value}`;
}


function formatPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatOrderDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function AdminDashboard(props: AdminDashboardProps) {
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [recentOrders, setRecentOrders] = useState<OrderResponse[]>(
    props.orders || []
  );
  const [selectedPeriod, setSelectedPeriod] = useState<DashboardPeriod>("month");
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setIsLoading(true);

      const [summaryData, ordersData] = await Promise.all([
        dashboardApi.getSummary(),
        orderApi.getAllOrders(),
      ]);

      setSummary(summaryData);
      setRecentOrders(ordersData);
    } catch {
      toast.error("Dashboard error", "Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const periodConfig = {
    day: {
      label: "Today",
      sales: summary?.salesToday,
      topProducts: summary?.topSellingProductsThisMonth ?? [],
    },
    week: {
      label: "This Week",
      sales: summary?.salesThisWeek,
      topProducts: summary?.topSellingProductsThisMonth ?? [],
    },
    month: {
      label: "This Month",
      sales: summary?.salesThisMonth,
      topProducts: summary?.topSellingProductsThisMonth ?? [],
    },
    quarter: {
      label: "This Quarter",
      sales: summary?.salesThisQuarter,
      topProducts: summary?.topSellingProductsThisMonth ?? [],
    },
    year: {
      label: "This Year",
      sales: summary?.salesThisYear,
      topProducts: summary?.topSellingProductsThisYear ?? [],
    },
  } satisfies Record<
    DashboardPeriod,
    {
      label: string;
      sales: SalesPeriodResponse | undefined;
      topProducts: ProductPerformanceResponse[];
    }
  >;

  const activePeriod = periodConfig[selectedPeriod];
  const sales = activePeriod.sales;

  const chartData = useMemo(
    () =>
      (sales?.dataPoints ?? []).map((item) => ({
        label: item.timeLabel,
        revenue: Number(item.revenue ?? 0),
      })),
    [sales]
  );

  const topProducts = activePeriod.topProducts ?? [];

  const sortedRecentOrders = useMemo(() => {
    return [...recentOrders]
      .sort(
        (a, b) =>
          new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      )
      .slice(0, 6);
  }, [recentOrders]);

  const statCards: StatCardProps[] = [
    {
      label: `${activePeriod.label} Revenue`,
      value: formatCurrency(Number(sales?.totalRevenue ?? 0)),
      subtext: `Previous: ${formatCurrency(
        Number(sales?.previousPeriodRevenue ?? 0)
      )}`,
      icon: DollarSign,
      iconClassName: "bg-primary/10 text-primary",
    },
    {
      label: "Revenue Growth",
      value: formatPercent(Number(sales?.percentageChange ?? 0)),
      subtext: "Compared with previous period",
      icon: TrendingUp,
      iconClassName: "bg-emerald-100 text-emerald-700",
    },
    {
      label: "Total Customers",
      value: (summary?.totalCustomers ?? 0).toLocaleString("vi-VN"),
      subtext: "All registered customers",
      icon: Users,
      iconClassName: "bg-sky-100 text-sky-700",
    },
    {
      label: "Total Orders",
      value: recentOrders.length.toLocaleString("vi-VN"),
      subtext: "",
      icon: ShoppingBag,
      iconClassName: "bg-amber-100 text-amber-700",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-muted border-t-primary" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Store performance overview with live data from the dashboard API
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-border bg-card p-1 shadow-sm">
          {(["day", "week", "month", "quarter", "year"] as DashboardPeriod[]).map(
            (period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {periodConfig[period].label}
              </button>
            )
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <SectionCard
          title={`Revenue Trend · ${activePeriod.label}`}
          actions={
            <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
              <ArrowUpRight className="h-3.5 w-3.5" />
              {formatPercent(Number(sales?.percentageChange ?? 0))}
            </div>
          }
        >
          {chartData.length > 0 ? (
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: 8, right: 8 }}>
                  <defs>
                    <linearGradient id="dashboardRevenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0f766e" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="4 4"
                    stroke="#d6d3d1"
                  />

                  <XAxis
                    dataKey="label"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#78716c" }}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#78716c" }}
                    tickFormatter={(value) => formatCompactCurrency(Number(value))}
                  />

                  <Tooltip
                    cursor={{ stroke: "#0f766e", strokeDasharray: "4 4" }}
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e7e5e4",
                      background: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number) => [formatCurrency(value), "Revenue"]}
                    labelFormatter={(label) => `Time: ${label}`}
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0f766e"
                    strokeWidth={3}
                    fill="url(#dashboardRevenueFill)"
                    dot={{ r: 3, strokeWidth: 2, fill: "#ffffff" }}
                    activeDot={{ r: 5, stroke: "#0f766e", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="No revenue data"
              description="This period does not have chart data yet."
            />
          )}
        </SectionCard>

        <SectionCard title={`Top Selling Products · ${selectedPeriod === "year" ? "Year" : "Month"}`}>
          {topProducts.length > 0 ? (
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topProducts.map((item) => ({
                    name:
                      item.productName.length > 18
                        ? `${item.productName.slice(0, 18)}...`
                        : item.productName,
                    quantity: item.totalQuantitySold,
                  }))}
                  layout="vertical"
                  margin={{ top: 8, right: 12, bottom: 8, left: 12 }}
                >
                  <CartesianGrid
                    horizontal={true}
                    vertical={false}
                    strokeDasharray="3 3"
                    stroke="#e7e5e4"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={110}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#57534e" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "1px solid #e7e5e4",
                      background: "#ffffff",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value: number) => [`${value}`, "Sold"]}
                  />
                  <Bar
                    dataKey="quantity"
                    radius={[0, 10, 10, 0]}
                    fill="#f59e0b"
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyState
              title="No top product data"
              description="The selected range has no product performance yet."
            />
          )}
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <SectionCard title="Recent Orders">
          {sortedRecentOrders.length > 0 ? (
            <div className="space-y-3">
              {sortedRecentOrders.map((order) => {
                const statusLabel = order.tracking || order.status;

                return (
                  <div
                    key={order.orderId}
                    className="flex items-center justify-between rounded-2xl border border-border bg-background/60 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">
                        Order #{order.orderId}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatOrderDate(order.orderDate)}
                      </p>
                    </div>

                    <div className="ml-4 flex flex-col items-end gap-2">
                      <p className="text-sm font-semibold text-foreground">
                        {formatCurrency(Number(order.finalAmount ?? 0))}
                      </p>
                      <OrderStatusBadge value={statusLabel} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No recent orders"
              description="Admin orders API returned no orders."
            />
          )}
        </SectionCard>

        <SectionCard title="Performance Snapshot">
          <div className="space-y-4">
            <div className="rounded-2xl bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Selected period revenue</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatCurrency(Number(sales?.totalRevenue ?? 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Package className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top products shown</p>
                  <p className="text-lg font-bold text-foreground">
                    {topProducts.length.toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Growth vs previous period</p>
                  <p className="text-lg font-bold text-foreground">
                    {formatPercent(Number(sales?.percentageChange ?? 0))}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-background p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Customer base</p>
                  <p className="text-lg font-bold text-foreground">
                    {(summary?.totalCustomers ?? 0).toLocaleString("vi-VN")}
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
