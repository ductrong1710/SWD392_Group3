import { fetchApi } from "./base-api";

export interface SalesDataPoint {
  timeLabel: string;
  revenue: number;
}

export interface SalesPeriodResponse {
  totalRevenue: number;
  previousPeriodRevenue: number;
  percentageChange: number;
  dataPoints: SalesDataPoint[];
}

export interface ProductPerformanceResponse {
  productId: number;
  productName: string;
  totalQuantitySold: number;
}

export interface DashboardSummaryResponse {
  salesToday: SalesPeriodResponse;
  salesThisWeek: SalesPeriodResponse;
  salesThisMonth: SalesPeriodResponse;
  salesThisQuarter: SalesPeriodResponse;
  salesThisYear: SalesPeriodResponse;
  topSellingProductsThisMonth: ProductPerformanceResponse[];
  leastSellingProductsThisMonth: ProductPerformanceResponse[];
  topSellingProductsThisYear: ProductPerformanceResponse[];
  leastSellingProductsThisYear: ProductPerformanceResponse[];
  totalCustomers: number;
}

export const dashboardApi = {
  getSummary: (): Promise<DashboardSummaryResponse> =>
    fetchApi<DashboardSummaryResponse>("/v1/dashboard/summary"),
};