import type { DashboardStats } from "../types"
import { fetchApi } from "./base-api"

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    return await fetchApi<DashboardStats>("/dashboard/stats")
  },
}