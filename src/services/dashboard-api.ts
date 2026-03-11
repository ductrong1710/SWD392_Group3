import type { DashboardStats } from "../types"
import { fetchApi } from "./base-api"

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    try {
      const [summary, sales, topProducts] = await Promise.all([
        fetchApi<any>("/v1/dashboard/summary"),
        fetchApi<any>("/v1/dashboard/sales?period=month"),
        fetchApi<any[]>("/v1/dashboard/products/top-selling?period=month&limit=5")
      ]);

      return {
        totalRevenue: summary?.totalRevenue ?? summary?.revenue ?? 0,
        newOrdersCount: summary?.newOrdersCount ?? summary?.totalOrders ?? 0,
        newUsersCount: summary?.newUsersCount ?? summary?.totalUsers ?? summary?.newCustomers ?? 0,
        
        revenueOverTime: sales?.dataPoints || sales?.revenueOverTime || [],
        
        topSellingProducts: topProducts || [],
      };
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      throw error;
    }
  },
}