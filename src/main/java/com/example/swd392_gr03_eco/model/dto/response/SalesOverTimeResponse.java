package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class SalesOverTimeResponse {
    private BigDecimal totalRevenue;
    private BigDecimal previousPeriodRevenue;
    private double percentageChange;
    private List<DataPoint> dataPoints;

    @Data
    @Builder
    public static class DataPoint {
        private String timeLabel; // e.g., "Day 1", "Week 1", "Jan", "Q1"
        private BigDecimal revenue;
    }
}
