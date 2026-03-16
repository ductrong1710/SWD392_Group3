import { fetchApi } from "./base-api";
export const dashboardApi = {
    getSummary: () => fetchApi("/v1/dashboard/summary"),
};
