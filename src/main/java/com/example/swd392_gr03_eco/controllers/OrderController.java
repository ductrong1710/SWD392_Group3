package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.OrderRequest;
import com.example.swd392_gr03_eco.service.interfaces.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final IOrderService orderService;

    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request, @SessionAttribute("cart") Object cart) {
        try {
            // Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
            Long userId = 1L; // Placeholder
            var result = orderService.createOrder(userId, cart, request);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getCurrentUserOrders() {
        // Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Long userId = 1L; // Placeholder for current user ID
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Integer orderId) {
        // Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Long userId = 1L; // Placeholder for current user ID
        try {
            return ResponseEntity.ok(orderService.getOrderDetails(orderId, userId));
        } catch (Exception e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer orderId) {
        // Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Long userId = 1L; // Placeholder for current user ID
        try {
            orderService.cancelOrder(orderId, userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
