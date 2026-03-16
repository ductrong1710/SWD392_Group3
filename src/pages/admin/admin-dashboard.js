"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, } from "recharts";
import { ArrowUpRight, DollarSign, Package, ShoppingBag, TrendingUp, Users, } from "lucide-react";
import { dashboardApi, } from "../../services/dashboard-api";
import { orderApi } from "../../services/order-api";
import { useToast } from "../../contexts/ToastContext";
function StatCard({ label, value, subtext, icon: Icon, iconClassName, }) {
    return (_jsx("div", { className: "rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground", children: label }), _jsx("p", { className: "mt-2 text-2xl font-bold leading-tight text-foreground", children: value }), _jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: subtext })] }), _jsx("div", { className: `flex h-12 w-12 items-center justify-center rounded-2xl ${iconClassName}`, children: _jsx(Icon, { className: "h-5 w-5" }) })] }) }));
}
function SectionCard({ title, actions, children, }) {
    return (_jsxs("section", { className: "overflow-hidden rounded-2xl border border-border bg-card shadow-sm", children: [_jsxs("div", { className: "flex items-center justify-between border-b border-border px-6 py-4", children: [_jsx("h3", { className: "text-base font-semibold text-foreground", children: title }), actions] }), _jsx("div", { className: "p-6", children: children })] }));
}
function EmptyState({ title, description, }) {
    return (_jsxs("div", { className: "flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 text-center", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: title }), _jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: description })] }));
}
function OrderStatusBadge({ value }) {
    const styles = {
        COMPLETED: "bg-emerald-100 text-emerald-700",
        DELIVERED: "bg-teal-100 text-teal-700",
        SHIPPING: "bg-sky-100 text-sky-700",
        PREPARING: "bg-amber-100 text-amber-700",
        CANCELLED: "bg-rose-100 text-rose-700",
        NOT_RECEIVED: "bg-slate-200 text-slate-700",
    };
    return (_jsx("span", { className: `inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${styles[value] ?? "bg-secondary text-foreground"}`, children: value }));
}
function formatCurrency(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value || 0);
}
function formatCompactCurrency(value) {
    if (!value)
        return "$0";
    if (Math.abs(value) >= 1000000000) {
        return `$${(value / 1000000000).toFixed(1)}B`;
    }
    if (Math.abs(value) >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
        return `$${(value / 1000).toFixed(1)}K`;
    }
    return `$${value}`;
}
function formatPercent(value) {
    const sign = value > 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
}
function formatOrderDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime()))
        return value;
    return new Intl.DateTimeFormat("vi-VN", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}
export default function AdminDashboard(props) {
    const [summary, setSummary] = useState(null);
    const [recentOrders, setRecentOrders] = useState(props.orders || []);
    const [selectedPeriod, setSelectedPeriod] = useState("month");
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
        }
        catch {
            toast.error("Dashboard error", "Failed to load dashboard data");
        }
        finally {
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
    };
    const activePeriod = periodConfig[selectedPeriod];
    const sales = activePeriod.sales;
    const chartData = useMemo(() => (sales?.dataPoints ?? []).map((item) => ({
        label: item.timeLabel,
        revenue: Number(item.revenue ?? 0),
    })), [sales]);
    const topProducts = activePeriod.topProducts ?? [];
    const sortedRecentOrders = useMemo(() => {
        return [...recentOrders]
            .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
            .slice(0, 6);
    }, [recentOrders]);
    const statCards = [
        {
            label: `${activePeriod.label} Revenue`,
            value: formatCurrency(Number(sales?.totalRevenue ?? 0)),
            subtext: `Previous: ${formatCurrency(Number(sales?.previousPeriodRevenue ?? 0))}`,
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
        return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-3 py-24", children: [_jsx("div", { className: "h-10 w-10 animate-spin rounded-full border-[3px] border-muted border-t-primary" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Loading dashboard..." })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Dashboard" }), _jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Store performance overview with live data from the dashboard API" })] }), _jsx("div", { className: "inline-flex rounded-xl border border-border bg-card p-1 shadow-sm", children: ["day", "week", "month", "quarter", "year"].map((period) => (_jsx("button", { onClick: () => setSelectedPeriod(period), className: `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${selectedPeriod === period
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`, children: periodConfig[period].label }, period))) })] }), _jsx("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: statCards.map((card) => (_jsx(StatCard, { ...card }, card.label))) }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-[1.6fr_1fr]", children: [_jsx(SectionCard, { title: `Revenue Trend · ${activePeriod.label}`, actions: _jsxs("div", { className: "flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground", children: [_jsx(ArrowUpRight, { className: "h-3.5 w-3.5" }), formatPercent(Number(sales?.percentageChange ?? 0))] }), children: chartData.length > 0 ? (_jsx("div", { className: "h-[340px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: chartData, margin: { left: 8, right: 8 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "dashboardRevenueFill", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#0f766e", stopOpacity: 0.35 }), _jsx("stop", { offset: "95%", stopColor: "#0f766e", stopOpacity: 0.03 })] }) }), _jsx(CartesianGrid, { vertical: false, strokeDasharray: "4 4", stroke: "#d6d3d1" }), _jsx(XAxis, { dataKey: "label", tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#78716c" } }), _jsx(YAxis, { tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#78716c" }, tickFormatter: (value) => formatCompactCurrency(Number(value)) }), _jsx(Tooltip, { cursor: { stroke: "#0f766e", strokeDasharray: "4 4" }, contentStyle: {
                                                borderRadius: "16px",
                                                border: "1px solid #e7e5e4",
                                                background: "#ffffff",
                                                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                            }, formatter: (value) => [formatCurrency(value), "Revenue"], labelFormatter: (label) => `Time: ${label}` }), _jsx(Area, { type: "monotone", dataKey: "revenue", stroke: "#0f766e", strokeWidth: 3, fill: "url(#dashboardRevenueFill)", dot: { r: 3, strokeWidth: 2, fill: "#ffffff" }, activeDot: { r: 5, stroke: "#0f766e", strokeWidth: 2 } })] }) }) })) : (_jsx(EmptyState, { title: "No revenue data", description: "This period does not have chart data yet." })) }), _jsx(SectionCard, { title: `Top Selling Products · ${selectedPeriod === "year" ? "Year" : "Month"}`, children: topProducts.length > 0 ? (_jsx("div", { className: "h-[340px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: topProducts.map((item) => ({
                                        name: item.productName.length > 18
                                            ? `${item.productName.slice(0, 18)}...`
                                            : item.productName,
                                        quantity: item.totalQuantitySold,
                                    })), layout: "vertical", margin: { top: 8, right: 12, bottom: 8, left: 12 }, children: [_jsx(CartesianGrid, { horizontal: true, vertical: false, strokeDasharray: "3 3", stroke: "#e7e5e4" }), _jsx(XAxis, { type: "number", hide: true }), _jsx(YAxis, { type: "category", dataKey: "name", width: 110, tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#57534e" } }), _jsx(Tooltip, { contentStyle: {
                                                borderRadius: "16px",
                                                border: "1px solid #e7e5e4",
                                                background: "#ffffff",
                                                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                            }, formatter: (value) => [`${value}`, "Sold"] }), _jsx(Bar, { dataKey: "quantity", radius: [0, 10, 10, 0], fill: "#f59e0b", barSize: 18 })] }) }) })) : (_jsx(EmptyState, { title: "No top product data", description: "The selected range has no product performance yet." })) })] }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-[1.15fr_0.85fr]", children: [_jsx(SectionCard, { title: "Recent Orders", children: sortedRecentOrders.length > 0 ? (_jsx("div", { className: "space-y-3", children: sortedRecentOrders.map((order) => {
                                const statusLabel = order.tracking || order.status;
                                return (_jsxs("div", { className: "flex items-center justify-between rounded-2xl border border-border bg-background/60 px-4 py-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "text-sm font-semibold text-foreground", children: ["Order #", order.orderId] }), _jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: formatOrderDate(order.orderDate) })] }), _jsxs("div", { className: "ml-4 flex flex-col items-end gap-2", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: formatCurrency(Number(order.finalAmount ?? 0)) }), _jsx(OrderStatusBadge, { value: statusLabel })] })] }, order.orderId));
                            }) })) : (_jsx(EmptyState, { title: "No recent orders", description: "Admin orders API returned no orders." })) }), _jsx(SectionCard, { title: "Performance Snapshot", children: _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "rounded-2xl bg-background p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary", children: _jsx(DollarSign, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Selected period revenue" }), _jsx("p", { className: "text-lg font-bold text-foreground", children: formatCurrency(Number(sales?.totalRevenue ?? 0)) })] })] }) }), _jsx("div", { className: "rounded-2xl bg-background p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-100 text-amber-700", children: _jsx(Package, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Top products shown" }), _jsx("p", { className: "text-lg font-bold text-foreground", children: topProducts.length.toLocaleString("vi-VN") })] })] }) }), _jsx("div", { className: "rounded-2xl bg-background p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700", children: _jsx(TrendingUp, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Growth vs previous period" }), _jsx("p", { className: "text-lg font-bold text-foreground", children: formatPercent(Number(sales?.percentageChange ?? 0)) })] })] }) }), _jsx("div", { className: "rounded-2xl bg-background p-4", children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-100 text-sky-700", children: _jsx(Users, { className: "h-5 w-5" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-muted-foreground", children: "Customer base" }), _jsx("p", { className: "text-lg font-bold text-foreground", children: (summary?.totalCustomers ?? 0).toLocaleString("vi-VN") })] })] }) })] }) })] })] }));
}
