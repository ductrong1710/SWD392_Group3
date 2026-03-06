package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.response.DashboardSummaryResponse;
import com.example.swd392_gr03_eco.model.dto.response.ProductPerformanceResponse;
import com.example.swd392_gr03_eco.model.dto.response.SalesOverTimeResponse;
import com.example.swd392_gr03_eco.repositories.OrderItemRepository;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import com.example.swd392_gr03_eco.service.interfaces.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.TemporalAdjusters;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements IDashboardService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    @Override
    public SalesOverTimeResponse getSalesOverTime(String period) {
        // Use UTC to match database timezone
        ZoneId zoneId = ZoneId.of("UTC"); 
        ZonedDateTime now = ZonedDateTime.now(zoneId);
        Instant startCurrent, endCurrent, startPrevious, endPrevious;
        String dateFormat;

        switch (period.toLowerCase()) {
            case "day":
                startCurrent = now.toLocalDate().atStartOfDay(zoneId).toInstant();
                endCurrent = startCurrent.plus(1, ChronoUnit.DAYS);
                startPrevious = startCurrent.minus(1, ChronoUnit.DAYS);
                endPrevious = startCurrent;
                dateFormat = "HH24";
                break;
            case "week":
                startCurrent = now.with(TemporalAdjusters.previousOrSame(java.time.DayOfWeek.MONDAY)).toLocalDate().atStartOfDay(zoneId).toInstant();
                endCurrent = startCurrent.plus(7, ChronoUnit.DAYS);
                startPrevious = startCurrent.minus(7, ChronoUnit.DAYS);
                endPrevious = startCurrent;
                dateFormat = "DY";
                break;
            case "month":
                startCurrent = now.withDayOfMonth(1).toLocalDate().atStartOfDay(zoneId).toInstant();
                endCurrent = now.with(TemporalAdjusters.lastDayOfMonth()).plusDays(1).toLocalDate().atStartOfDay(zoneId).toInstant();
                startPrevious = now.withDayOfMonth(1).minusMonths(1).toLocalDate().atStartOfDay(zoneId).toInstant();
                endPrevious = startCurrent;
                dateFormat = "DD";
                break;
            case "quarter":
                int currentQuarter = (now.getMonthValue() - 1) / 3 + 1;
                LocalDate firstDayOfQuarter = LocalDate.of(now.getYear(), (currentQuarter - 1) * 3 + 1, 1);
                startCurrent = firstDayOfQuarter.atStartOfDay(zoneId).toInstant();
                endCurrent = firstDayOfQuarter.plusMonths(3).atStartOfDay(zoneId).toInstant();
                startPrevious = firstDayOfQuarter.minusMonths(3).atStartOfDay(zoneId).toInstant();
                endPrevious = startCurrent;
                dateFormat = "MM";
                break;
            case "year":
                startCurrent = now.withDayOfYear(1).toLocalDate().atStartOfDay(zoneId).toInstant();
                endCurrent = now.withDayOfYear(1).plusYears(1).toLocalDate().atStartOfDay(zoneId).toInstant();
                startPrevious = now.withDayOfYear(1).minusYears(1).toLocalDate().atStartOfDay(zoneId).toInstant();
                endPrevious = startCurrent;
                dateFormat = "Mon";
                break;
            default:
                throw new IllegalArgumentException("Invalid period specified.");
        }

        BigDecimal totalCurrent = orderRepository.findTotalRevenueBetween(startCurrent, endCurrent);
        BigDecimal totalPrevious = orderRepository.findTotalRevenueBetween(startPrevious, endPrevious);
        
        List<SalesOverTimeResponse.DataPoint> dataPoints = orderRepository.findSalesDataByPeriodNative(startCurrent, endCurrent, dateFormat)
                .stream()
                .map(p -> SalesOverTimeResponse.DataPoint.builder()
                        .timeLabel(p.getTimeLabel())
                        .revenue(p.getRevenue())
                        .build())
                .collect(Collectors.toList());

        double percentageChange = 0;
        if (totalPrevious.compareTo(BigDecimal.ZERO) > 0) {
            percentageChange = totalCurrent.subtract(totalPrevious)
                    .divide(totalPrevious, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        } else if (totalCurrent.compareTo(BigDecimal.ZERO) > 0) {
            percentageChange = 100.0;
        }

        return SalesOverTimeResponse.builder()
                .totalRevenue(totalCurrent)
                .previousPeriodRevenue(totalPrevious)
                .percentageChange(percentageChange)
                .dataPoints(dataPoints)
                .build();
    }

    @Override
    public List<ProductPerformanceResponse> getTopSellingProducts(String period, int limit) {
        Instant[] dates = getStartAndEndDatesForPeriod(period);
        Pageable pageable = PageRequest.of(0, limit);
        return orderItemRepository.findProductPerformance(dates[0], dates[1], pageable);
    }

    @Override
    public List<ProductPerformanceResponse> getLeastSellingProducts(String period, int limit) {
        Instant[] dates = getStartAndEndDatesForPeriod(period);
        List<ProductPerformanceResponse> allProducts = orderItemRepository.findProductPerformance(dates[0], dates[1], Pageable.unpaged());
        return allProducts.subList(Math.max(allProducts.size() - limit, 0), allProducts.size());
    }

    @Override
    public long getTotalCustomers() {
        return userRepository.countByRoleName("CUSTOMER");
    }

    @Override
    public DashboardSummaryResponse getDashboardSummary() {
        return DashboardSummaryResponse.builder()
                .salesToday(getSalesOverTime("day"))
                .salesThisWeek(getSalesOverTime("week"))
                .salesThisMonth(getSalesOverTime("month"))
                .salesThisQuarter(getSalesOverTime("quarter"))
                .salesThisYear(getSalesOverTime("year"))
                .topSellingProductsThisMonth(getTopSellingProducts("month", 5))
                .leastSellingProductsThisMonth(getLeastSellingProducts("month", 5))
                .topSellingProductsThisYear(getTopSellingProducts("year", 5))
                .leastSellingProductsThisYear(getLeastSellingProducts("year", 5))
                .totalCustomers(getTotalCustomers())
                .build();
    }

    private Instant[] getStartAndEndDatesForPeriod(String period) {
        // Use UTC to match database timezone
        ZoneId zoneId = ZoneId.of("UTC");
        ZonedDateTime now = ZonedDateTime.now(zoneId);
        Instant start, end;
        if ("month".equalsIgnoreCase(period)) {
            start = now.withDayOfMonth(1).toLocalDate().atStartOfDay(zoneId).toInstant();
            end = now.with(TemporalAdjusters.lastDayOfMonth()).plusDays(1).toLocalDate().atStartOfDay(zoneId).toInstant();
        } else if ("year".equalsIgnoreCase(period)) {
            start = now.withDayOfYear(1).toLocalDate().atStartOfDay(zoneId).toInstant();
            end = now.withDayOfYear(1).plusYears(1).toLocalDate().atStartOfDay(zoneId).toInstant();
        } else {
            throw new IllegalArgumentException("Invalid period for product performance.");
        }
        return new Instant[]{start, end};
    }
}
