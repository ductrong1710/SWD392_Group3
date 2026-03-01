import { fetchApi } from "./base-api";
import type { DashboardStats } from "../types";

export const dashboardApi = {
  getStats: (): Promise<DashboardStats> => fetchApi("/dashboard/stats"),
};