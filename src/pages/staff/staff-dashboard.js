"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";
import { TrendingUp, ShoppingBag, Users, DollarSign, Package, ArrowUpRight } from "lucide-react";
import { dashboardApi } from "../../services/dashboard-api";
import { useToast } from "../../contexts/ToastContext";
function StatCard({ label, value, change, icon: Icon, iconBg }) {
    return (_jsxs("div", { className: "bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: `flex items-center justify-center w-12 h-12 rounded-xl ${iconBg}`, children: _jsx(Icon, { className: "w-5 h-5" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-xs font-medium text-muted-foreground uppercase tracking-wide", children: label }), _jsx("p", { className: "text-2xl font-bold text-foreground leading-tight mt-0.5", children: value })] })] }), _jsxs("div", { className: "mt-4 flex items-center gap-1 text-xs font-medium text-green-600", children: [_jsx(ArrowUpRight, { className: "w-3.5 h-3.5" }), change] })] }));
}
function SectionCard({ title, children, className = "", }) {
    return (_jsxs("div", { className: `bg-card border border-border rounded-2xl shadow-sm ${className}`, children: [_jsx("div", { className: "px-6 py-4 border-b border-border", children: _jsx("h3", { className: "text-base font-semibold text-foreground", children: title }) }), _jsx("div", { className: "p-6", children: children })] }));
}
function OrderStatusBadge({ status }) {
    const styles = {
        COMPLETED: "bg-green-100 text-green-700",
        CANCELLED: "bg-red-100 text-red-700",
        SHIPPING: "bg-blue-100 text-blue-700",
        PENDING: "bg-yellow-100 text-yellow-700",
    };
    const cls = styles[status] ?? styles.PENDING;
    return (_jsx("span", { className: `inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${cls}`, children: status }));
}
function formatCurrency(amount) {
    return amount.toLocaleString("vi-VN") + "₫";
}
export default function AdminDashboard({ products, orders, reviews, users, }) {
    const [stats, setStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();
    useEffect(() => {
        loadDashboardStats();
    }, []);
    const loadDashboardStats = async () => {
        try {
            setIsLoading(true);
            const summary = await dashboardApi.getSummary();
            setStats({
                totalRevenue: summary.salesThisMonth.totalRevenue,
                newOrdersCount: 0,
                newUsersCount: summary.totalCustomers,
                revenueOverTime: [],
                topSellingProducts: summary.topSellingProductsThisMonth.map((p) => ({
                    productId: p.productId,
                    productName: p.productName,
                    totalQuantitySold: p.totalQuantitySold,
                })),
            });
        }
        catch {
            toast.error("Dashboard error", "Failed to load dashboard statistics");
        }
        finally {
            setIsLoading(false);
        }
    };
    const totalRevenue = stats?.totalRevenue ?? 0;
    const newOrders = stats?.newOrdersCount ?? 0;
    const newUsers = stats?.newUsersCount ?? 0;
    const statCards = [
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
    ];
    const chartData = stats?.revenueOverTime?.map((item) => ({
        name: item.date,
        revenue: item.revenue,
    })) ?? [];
    const topProducts = stats?.topSellingProducts ?? [];
    if (isLoading) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center py-24 gap-3", children: [_jsx("div", { className: "animate-spin rounded-full h-10 w-10 border-[3px] border-muted border-t-primary" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u\u2026" })] }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-foreground", children: "Dashboard" }), _jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "T\u1ED5ng quan hi\u1EC7u su\u1EA5t c\u1EEDa h\u00E0ng" })] }), _jsx("div", { className: "grid grid-cols-4 gap-4", children: statCards.map((stat) => (_jsx(StatCard, { ...stat }, stat.label))) }), _jsx(SectionCard, { title: "Bi\u1EC3u \u0111\u1ED3 doanh thu theo ng\u00E0y", children: chartData.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: 320, children: _jsxs(BarChart, { data: chartData, barSize: 32, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--color-border)", vertical: false }), _jsx(XAxis, { dataKey: "name", stroke: "var(--color-muted-foreground)", tick: { fontSize: 12 }, tickLine: false, axisLine: false }), _jsx(YAxis, { stroke: "var(--color-muted-foreground)", tick: { fontSize: 12 }, tickLine: false, axisLine: false, tickFormatter: (v) => v.toLocaleString("vi-VN") + "₫" }), _jsx(Tooltip, { contentStyle: {
                                    backgroundColor: "var(--color-card)",
                                    border: "1px solid var(--color-border)",
                                    borderRadius: "0.75rem",
                                    fontSize: 13,
                                }, formatter: (value) => [formatCurrency(value), "Doanh thu"], labelFormatter: (label) => `Ngày: ${label}` }), _jsx(Legend, { wrapperStyle: { fontSize: 13 } }), _jsx(Bar, { dataKey: "revenue", fill: "var(--color-primary)", name: "Doanh thu", radius: [6, 6, 0, 0] })] }) })) : (_jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-muted-foreground", children: [_jsx(DollarSign, { className: "w-10 h-10 mb-2 opacity-40" }), _jsx("p", { className: "text-sm", children: "Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u doanh thu" })] })) }), _jsxs("div", { className: "grid grid-cols-2 gap-6", children: [_jsx(SectionCard, { title: "S\u1EA3n ph\u1EA9m b\u00E1n ch\u1EA1y nh\u1EA5t", children: topProducts.length > 0 ? (_jsx("ul", { className: "divide-y divide-border", children: topProducts.map((product, index) => (_jsxs("li", { className: "flex items-center gap-4 py-3 first:pt-0 last:pb-0", children: [_jsxs("span", { className: "flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-xs font-bold text-muted-foreground", children: ["#", index + 1] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("p", { className: "text-sm font-medium text-foreground truncate", children: product.productName }), _jsxs("p", { className: "text-xs text-muted-foreground", children: ["\u0110\u00E3 b\u00E1n: ", product.totalQuantitySold, " s\u1EA3n ph\u1EA9m"] })] }), _jsx(Package, { className: "w-4 h-4 text-muted-foreground/50 shrink-0" })] }, product.productId))) })) : (_jsxs("div", { className: "flex flex-col items-center justify-center py-10 text-muted-foreground", children: [_jsx(ShoppingBag, { className: "w-10 h-10 mb-2 opacity-40" }), _jsx("p", { className: "text-sm", children: "Ch\u01B0a c\u00F3 d\u1EEF li\u1EC7u b\u00E1n h\u00E0ng" })] })) }), _jsx(SectionCard, { title: "\u0110\u01A1n h\u00E0ng g\u1EA7n \u0111\u00E2y", children: orders.length > 0 ? (_jsx("ul", { className: "divide-y divide-border", children: orders.slice(0, 5).map((order) => (_jsxs("li", { className: "flex items-center justify-between py-3 first:pt-0 last:pb-0", children: [_jsxs("div", { className: "min-w-0", children: [_jsxs("p", { className: "text-sm font-medium text-foreground", children: ["\u0110\u01A1n h\u00E0ng #", order.orderId] }), _jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: order.orderDate })] }), _jsxs("div", { className: "flex flex-col items-end gap-1 shrink-0 ml-4", children: [_jsx("p", { className: "text-sm font-semibold text-foreground", children: formatCurrency(order.finalAmount) }), _jsx(OrderStatusBadge, { status: order.status })] })] }, order.orderId))) })) : (_jsxs("div", { className: "flex flex-col items-center justify-center py-10 text-muted-foreground", children: [_jsx(ShoppingBag, { className: "w-10 h-10 mb-2 opacity-40" }), _jsx("p", { className: "text-sm", children: "Ch\u01B0a c\u00F3 \u0111\u01A1n h\u00E0ng" })] })) })] })] }));
}
