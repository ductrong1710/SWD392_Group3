package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.entities.Order;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.service.interfaces.IOrderTrackingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderTrackingController {

    private final IOrderTrackingService orderTrackingService;

    @PatchMapping("/{orderId}/tracking")
    public ResponseEntity<Order> updateTrackingStatus(
            @PathVariable Integer orderId,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User currentUser) {

        String newTracking = payload.get("tracking");
        if (newTracking == null || newTracking.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Order updatedOrder = orderTrackingService.updateTracking(orderId, newTracking, currentUser);
        return ResponseEntity.ok(updatedOrder);
    }
}
