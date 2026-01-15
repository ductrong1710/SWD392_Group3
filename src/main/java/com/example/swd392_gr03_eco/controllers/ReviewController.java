package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.ReviewRequest;
import com.example.swd392_gr03_eco.service.interfaces.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReviewController {

    private final IReviewService reviewService;

    @PostMapping("/reviews")
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request) {
        // Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Long userId = 1L; // Placeholder
        try {
            return ResponseEntity.ok(reviewService.createReview(userId, request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<?> getReviewsByProduct(@PathVariable Integer productId) {
        return ResponseEntity.ok(reviewService.getReviewsByProductId(productId));
    }
}
