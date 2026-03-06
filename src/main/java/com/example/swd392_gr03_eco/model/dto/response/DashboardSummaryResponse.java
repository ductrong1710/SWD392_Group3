package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardSummaryResponse {
    private SalesOverTimeResponse salesToday;
    private SalesOverTimeResponse salesThisWeek;
    private SalesOverTimeResponse salesThisMonth;
    private SalesOverTimeResponse salesThisQuarter;
    private SalesOverTimeResponse salesThisYear;
    private List<ProductPerformanceResponse> topSellingProductsThisMonth;
    private List<ProductPerformanceResponse> leastSellingProductsThisMonth;
    private List<ProductPerformanceResponse> topSellingProductsThisYear;
    private List<ProductPerformanceResponse> leastSellingProductsThisYear;
    private long totalCustomers;
}
