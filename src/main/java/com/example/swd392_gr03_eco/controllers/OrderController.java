package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.OrderRequest;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.service.interfaces.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class OrderController {

    private final IOrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@AuthenticationPrincipal User user, @RequestBody OrderRequest request, @SessionAttribute("cart") Object cart) {
        try {
            var result = orderService.createOrder(user.getId().longValue(), cart, request);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getCurrentUserOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(user.getId().longValue()));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(@AuthenticationPrincipal User user, @PathVariable Integer orderId) {
        try {
            return ResponseEntity.ok(orderService.getOrderDetails(orderId, user.getId().longValue()));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> cancelOrder(@AuthenticationPrincipal User user, @PathVariable Integer orderId) {
        try {
            orderService.cancelOrder(orderId, user.getId().longValue());
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
