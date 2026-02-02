package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.response.OrderResponse;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.service.interfaces.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final IOrderService orderService;

    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponse>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getMyOrders(user));
    }

    @GetMapping("/my-orders/{orderId}")
    public ResponseEntity<OrderResponse> getMyOrderDetails(@AuthenticationPrincipal User user, @PathVariable Integer orderId) {
        return ResponseEntity.ok(orderService.getMyOrderDetails(user, orderId));
    }

    @PostMapping("/{orderId}/cancel")
    public ResponseEntity<Void> cancelMyOrder(@AuthenticationPrincipal User user, @PathVariable Integer orderId) {
        orderService.cancelMyOrder(user, orderId);
        return ResponseEntity.noContent().build();
    }
}
