package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.service.interfaces.IDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/dashboard")
@RequiredArgsConstructor
@PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
public class DashboardController {

    private final IDashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }
}
