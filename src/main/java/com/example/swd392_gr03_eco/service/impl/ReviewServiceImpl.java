package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.ReviewRequest;
import com.example.swd392_gr03_eco.model.dto.response.ReviewResponseDto;
import com.example.swd392_gr03_eco.model.entities.OrderItem;
import com.example.swd392_gr03_eco.model.entities.Review;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.repositories.OrderItemRepository;
import com.example.swd392_gr03_eco.repositories.ReviewRepository;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import com.example.swd392_gr03_eco.service.interfaces.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant; // Import Instant
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements IReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;

    @Override
    public ReviewResponseDto createReview(Long userId, ReviewRequest request) {
        OrderItem orderItem = orderItemRepository.findById(request.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("Order item not found"));

        if (!orderItem.getOrder().getUser().getId().equals(userId.intValue())) {
            throw new SecurityException("You can only review items from your own orders.");
        }
        
        if (!"COMPLETED".equals(orderItem.getOrder().getStatus())) {
            throw new RuntimeException("You can only review items from completed orders.");
        }

        boolean hasReviewed = reviewRepository.existsByOrderItemId(request.getOrderItemId());
        if (hasReviewed) {
            throw new RuntimeException("You have already reviewed this item.");
        }

        User user = userRepository.findById(userId.intValue()).orElseThrow(() -> new RuntimeException("User not found"));

        Review review = Review.builder()
                .user(user)
                .orderItem(orderItem)
                .rating(request.getRating())
                .comment(request.getComment())
                .createdAt(Instant.now()) // Use Instant.now()
                .build();

        Review savedReview = reviewRepository.save(review);
        return mapReviewToDto(savedReview);
    }

    @Override
    public List<ReviewResponseDto> getReviewsByOrderItemId(Integer orderItemId) {
        return reviewRepository.findByOrderItemId(orderItemId).stream()
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
