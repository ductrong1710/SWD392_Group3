package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class DashboardStatsDto {
    private BigDecimal totalRevenue;
    private Long newOrdersCount;
    private Long newUsersCount;
    private List<RevenueOverTimeDto> revenueOverTime;
    private List<TopSellingProductDto> topSellingProducts;
}
