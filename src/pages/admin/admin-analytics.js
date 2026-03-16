"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, } from "recharts";
import { Activity, DollarSign, Package, ShoppingBag, TrendingUp, } from "lucide-react";
import { dashboardApi, } from "../../services/dashboard-api";
import { orderApi } from "../../services/order-api";
import { useToast } from "../../contexts/ToastContext";
const PIE_COLORS = ["#0f766e", "#f59e0b", "#2563eb", "#dc2626", "#7c3aed", "#ea580c"];
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
    if (Math.abs(value) >= 1000000000)
        return `$${(value / 1000000000).toFixed(1)}B`;
    if (Math.abs(value) >= 1000000)
        return `$${(value / 1000000).toFixed(1)}M`;
    if (Math.abs(value) >= 1000)
        return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
}
function InsightCard({ title, value, note, icon: Icon, iconClassName, }) {
    return (_jsx("div", { className: "rounded-2xl border border-border bg-card p-5 shadow-sm", children: _jsxs("div", { className: "flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs uppercase tracking-[0.18em] text-muted-foreground", children: title }), _jsx("p", { className: "mt-2 text-2xl font-bold text-foreground", children: value }), _jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: note })] }), _jsx("div", { className: `flex h-11 w-11 items-center justify-center rounded-2xl ${iconClassName}`, children: _jsx(Icon, { className: "h-5 w-5" }) })] }) }));
}
function SectionCard({ title, children, }) {
    return (_jsxs("section", { className: "overflow-hidden rounded-2xl border border-border bg-card shadow-sm", children: [_jsx("div", { className: "border-b border-border px-6 py-4", children: _jsx("h3", { className: "text-base font-semibold text-foreground", children: title }) }), _jsx("div", { className: "p-6", children: children })] }));
}
export default function AdminAnalytics({ products, orders: initialOrders }) {
    const [summary, setSummary] = useState(null);
    const [orders, setOrders] = useState(initialOrders || []);
    const [selectedPeriod, setSelectedPeriod] = useState("month");
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
        }
        catch {
            toast.error("Analytics error", "Failed to load analytics data");
        }
        finally {
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
    const revenueChartData = useMemo(() => (activeSales?.dataPoints ?? []).map((item) => ({
        label: item.timeLabel,
        revenue: Number(item.revenue ?? 0),
    })), [activeSales]);
    const topProducts = selectedPeriod === "year"
        ? summary?.topSellingProductsThisYear ?? []
        : summary?.topSellingProductsThisMonth ?? [];
    const topProductsPieData = topProducts.map((item) => ({
        name: item.productName.length > 20
            ? `${item.productName.slice(0, 20)}...`
            : item.productName,
        value: item.totalQuantitySold,
    }));
    const orderStatusData = useMemo(() => {
        const grouped = orders.reduce((acc, order) => {
            const key = order.tracking || order.status || "UNKNOWN";
            acc[key] = (acc[key] ?? 0) + 1;
            return acc;
        }, {});
        return Object.entries(grouped).map(([status, count]) => ({
            status,
            count,
        }));
    }, [orders]);
    const averageOrderValue = orders.length > 0
        ? orders.reduce((sum, order) => sum + Number(order.finalAmount ?? 0), 0) /
            orders.length
        : 0;
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-20", children: _jsx("div", { className: "h-12 w-12 animate-spin rounded-full border-b-2 border-primary" }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-serif font-semibold", children: "Analytics & Insights" }), _jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: "Revenue, order behavior and product performance" })] }), _jsx("div", { className: "inline-flex rounded-xl border border-border bg-card p-1 shadow-sm", children: ["week", "month", "quarter", "year"].map((period) => (_jsx("button", { onClick: () => setSelectedPeriod(period), className: `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${selectedPeriod === period
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`, children: period }, period))) })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4", children: [_jsx(InsightCard, { title: "Revenue", value: formatCurrency(Number(activeSales?.totalRevenue ?? 0)), note: "Selected period revenue", icon: DollarSign, iconClassName: "bg-primary/10 text-primary" }), _jsx(InsightCard, { title: "Growth", value: `${Number(activeSales?.percentageChange ?? 0).toFixed(1)}%`, note: "Compared with previous period", icon: TrendingUp, iconClassName: "bg-emerald-100 text-emerald-700" }), _jsx(InsightCard, { title: "Avg Order Value", value: formatCurrency(averageOrderValue), note: "", icon: ShoppingBag, iconClassName: "bg-amber-100 text-amber-700" }), _jsx(InsightCard, { title: "Catalog Size", value: products.length.toLocaleString("vi-VN"), note: "Products currently in catalog", icon: Package, iconClassName: "bg-sky-100 text-sky-700" })] }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-[1.5fr_1fr]", children: [_jsx(SectionCard, { title: "Revenue Trend", children: revenueChartData.length > 0 ? (_jsx("div", { className: "h-[340px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(AreaChart, { data: revenueChartData, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "analyticsRevenueFill", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#0f766e", stopOpacity: 0.35 }), _jsx("stop", { offset: "95%", stopColor: "#0f766e", stopOpacity: 0.04 })] }) }), _jsx(CartesianGrid, { vertical: false, strokeDasharray: "4 4", stroke: "#e7e5e4" }), _jsx(XAxis, { dataKey: "label", tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#78716c" } }), _jsx(YAxis, { tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#78716c" }, tickFormatter: (value) => formatCompactCurrency(Number(value)) }), _jsx(Tooltip, { contentStyle: {
                                                borderRadius: "16px",
                                                border: "1px solid #e7e5e4",
                                                background: "#ffffff",
                                                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                            }, formatter: (value) => [formatCurrency(value), "Revenue"] }), _jsx(Area, { type: "monotone", dataKey: "revenue", stroke: "#0f766e", strokeWidth: 3, fill: "url(#analyticsRevenueFill)", dot: { r: 3, fill: "#ffffff", stroke: "#0f766e", strokeWidth: 2 } })] }) }) })) : (_jsx("div", { className: "py-16 text-center text-sm text-muted-foreground", children: "No revenue data available" })) }), _jsx(SectionCard, { title: "Order Status Breakdown", children: orderStatusData.length > 0 ? (_jsx("div", { className: "h-[340px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: orderStatusData, barSize: 28, children: [_jsx(CartesianGrid, { vertical: false, strokeDasharray: "3 3", stroke: "#e7e5e4" }), _jsx(XAxis, { dataKey: "status", tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#78716c" } }), _jsx(YAxis, { tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#78716c" } }), _jsx(Tooltip, { contentStyle: {
                                                borderRadius: "16px",
                                                border: "1px solid #e7e5e4",
                                                background: "#ffffff",
                                                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                            } }), _jsx(Bar, { dataKey: "count", radius: [10, 10, 0, 0], fill: "#f59e0b" })] }) }) })) : (_jsx("div", { className: "py-16 text-center text-sm text-muted-foreground", children: "No order data available" })) })] }), _jsxs("div", { className: "grid gap-6 xl:grid-cols-[1fr_1fr]", children: [_jsx(SectionCard, { title: "Top Selling Products", children: topProductsPieData.length > 0 ? (_jsx("div", { className: "h-[340px]", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(PieChart, { children: [_jsx(Pie, { data: topProductsPieData, dataKey: "value", nameKey: "name", innerRadius: 68, outerRadius: 108, paddingAngle: 4, children: topProductsPieData.map((_, index) => (_jsx(Cell, { fill: PIE_COLORS[index % PIE_COLORS.length] }, index))) }), _jsx(Tooltip, { contentStyle: {
                                                borderRadius: "16px",
                                                border: "1px solid #e7e5e4",
                                                background: "#ffffff",
                                                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                                            } })] }) }) })) : (_jsx("div", { className: "py-16 text-center text-sm text-muted-foreground", children: "No top-selling product data" })) }), _jsx(SectionCard, { title: "Quick Insights", children: _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "rounded-2xl bg-background p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Activity, { className: "mt-0.5 h-5 w-5 text-primary" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: "Best Seller" }), _jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [topProducts[0]?.productName ?? "N/A", " \u00B7 ", topProducts[0]?.totalQuantitySold ?? 0, " sold"] })] })] }) }), _jsx("div", { className: "rounded-2xl bg-background p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(ShoppingBag, { className: "mt-0.5 h-5 w-5 text-amber-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: "Orders Count" }), _jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [orders.length.toLocaleString("vi-VN"), " orders from admin orders API"] })] })] }) }), _jsx("div", { className: "rounded-2xl bg-background p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(DollarSign, { className: "mt-0.5 h-5 w-5 text-emerald-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: "Previous Revenue" }), _jsx("p", { className: "mt-1 text-sm text-muted-foreground", children: formatCurrency(Number(activeSales?.previousPeriodRevenue ?? 0)) })] })] }) }), _jsx("div", { className: "rounded-2xl bg-background p-4", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(TrendingUp, { className: "mt-0.5 h-5 w-5 text-sky-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: "Growth Trend" }), _jsxs("p", { className: "mt-1 text-sm text-muted-foreground", children: [Number(activeSales?.percentageChange ?? 0).toFixed(1), "% versus previous period"] })] })] }) })] }) })] })] }));
}
