package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.response.DashboardSummaryResponse;
import com.example.swd392_gr03_eco.model.dto.response.ProductPerformanceResponse;
import com.example.swd392_gr03_eco.model.dto.response.SalesOverTimeResponse;

import java.util.List;

public interface IDashboardService {

    /**
     * Retrieves sales data for a specified time period (day, week, month, quarter, year).
     * Compares with the previous period.
     * @param period The time period ("day", "week", "month", "quarter", "year").
     * @return Sales data including comparison with the previous period.
     */
    SalesOverTimeResponse getSalesOverTime(String period);

    /**
     * Retrieves the best-selling products for a specified time period.
     * @param period "month" or "year".
     * @param limit The number of products to return.
     * @return A list of best-selling products.
     */
    List<ProductPerformanceResponse> getTopSellingProducts(String period, int limit);

    /**
     * Retrieves the least-selling products for a specified time period.
     * @param period "month" or "year".
     * @param limit The number of products to return.
     * @return A list of least-selling products.
     */
    List<ProductPerformanceResponse> getLeastSellingProducts(String period, int limit);

    /**
     * Retrieves the total number of customers.
     * @return The total count of users with the "CUSTOMER" role.
     */
    long getTotalCustomers();

    /**
     * Retrieves a comprehensive summary for the main dashboard.
     * @return A summary object containing all key dashboard metrics.
     */
    DashboardSummaryResponse getDashboardSummary();
}
