package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.response.DashboardStatsDto;
import com.example.swd392_gr03_eco.model.dto.response.RevenueOverTimeDto;
import com.example.swd392_gr03_eco.model.dto.response.TopSellingProductDto;
import com.example.swd392_gr03_eco.repositories.OrderItemRepository;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import com.example.swd392_gr03_eco.service.interfaces.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements IDashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public DashboardStatsDto getDashboardStats() {
        Instant last30days = Instant.now().minus(30, ChronoUnit.DAYS);

        BigDecimal totalRevenue = orderRepository.findTotalRevenue();
        Long newOrdersCount = orderRepository.countNewOrdersSince(last30days);
        Long newUsersCount = userRepository.countNewUsersSince(last30days);
        List<RevenueOverTimeDto> revenueOverTime = orderRepository.findRevenueOverTime(last30days);
        List<TopSellingProductDto> topSellingProducts = orderItemRepository.findTopSellingProducts();

        return DashboardStatsDto.builder()
                .totalRevenue(totalRevenue)
                .newOrdersCount(newOrdersCount)
                .newUsersCount(newUsersCount)
                .revenueOverTime(revenueOverTime)
                .topSellingProducts(topSellingProducts)
                .build();
    }
}
