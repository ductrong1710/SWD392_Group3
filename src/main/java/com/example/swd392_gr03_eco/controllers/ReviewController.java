package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.ReviewRequest;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.service.interfaces.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final IReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAuthority('CUSTOMER')") // Only customers can write reviews
    public ResponseEntity<?> createReview(@AuthenticationPrincipal User user, @RequestBody ReviewRequest request) {
        try {
            return ResponseEntity.ok(reviewService.createReview(user.getId().longValue(), request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/order-item/{orderItemId}")
    public ResponseEntity<?> getReviewsByOrderItem(@PathVariable Integer orderItemId) {
        return ResponseEntity.ok(reviewService.getReviewsByOrderItemId(orderItemId));
    }
}
