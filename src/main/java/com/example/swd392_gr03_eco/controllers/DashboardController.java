package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.response.DashboardSummaryResponse;
import com.example.swd392_gr03_eco.model.dto.response.ProductPerformanceResponse;
import com.example.swd392_gr03_eco.model.dto.response.SalesOverTimeResponse;
import com.example.swd392_gr03_eco.service.interfaces.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final IDashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryResponse> getDashboardSummary() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }

    @GetMapping("/sales")
    public ResponseEntity<SalesOverTimeResponse> getSalesOverTime(@RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok(dashboardService.getSalesOverTime(period));
    }

    @GetMapping("/products/top-selling")
    public ResponseEntity<List<ProductPerformanceResponse>> getTopSellingProducts(
            @RequestParam(defaultValue = "month") String period,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getTopSellingProducts(period, limit));
    }

    @GetMapping("/products/least-selling")
    public ResponseEntity<List<ProductPerformanceResponse>> getLeastSellingProducts(
            @RequestParam(defaultValue = "month") String period,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getLeastSellingProducts(period, limit));
    }

    @GetMapping("/customers/total")
    public ResponseEntity<Long> getTotalCustomers() {
        return ResponseEntity.ok(dashboardService.getTotalCustomers());
    }
}
