package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.ReviewRequest;
import com.example.swd392_gr03_eco.model.dto.response.ReviewResponseDto;
import com.example.swd392_gr03_eco.model.entities.Product;
import com.example.swd392_gr03_eco.model.entities.Review;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.repositories.ProductRepository;
import com.example.swd392_gr03_eco.repositories.ReviewRepository;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import com.example.swd392_gr03_eco.service.interfaces.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public ReviewResponseDto createReview(Long userId, ReviewRequest request) {
        // 1. Check if user has purchased this product
        boolean hasPurchased = orderRepository.existsByUserIdAndProductIdAndStatus(userId.intValue(), request.getProductId(), "COMPLETED");
        if (!hasPurchased) {
            throw new RuntimeException("You can only review products you have purchased and the order is completed.");
        }

        // 2. Check if user has already reviewed this product
        boolean hasReviewed = reviewRepository.existsByUserIdAndProductId(userId.intValue(), request.getProductId());
        if (hasReviewed) {
            throw new RuntimeException("You have already reviewed this product.");
        }

        User user = userRepository.findById(userId.intValue()).orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepository.findById(request.getProductId()).orElseThrow(() -> new RuntimeException("Product not found"));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();

        Review savedReview = reviewRepository.save(review);
        return mapReviewToDto(savedReview);
    }

    @Override
    public List<ReviewResponseDto> getReviewsByProductId(Integer productId) {
        return reviewRepository.findByProductId(productId).stream()
                .map(this::mapReviewToDto)
                .collect(Collectors.toList());
    }

    private ReviewResponseDto mapReviewToDto(Review review) {
        return ReviewResponseDto.builder()
                .reviewId(review.getId())
                .userName(review.getUser().getFullName())
                .rating(review.getRating())
                .comment(review.getComment())
                .createdAt(review.getCreatedAt())
                .build();
    }
}
