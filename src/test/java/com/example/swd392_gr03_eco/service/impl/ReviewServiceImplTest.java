package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.ReviewRequest;
import com.example.swd392_gr03_eco.model.entities.Product;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.repositories.ProductRepository;
import com.example.swd392_gr03_eco.repositories.ReviewRepository;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceImplTest {

    @Mock private ReviewRepository reviewRepository;
    @Mock private OrderRepository orderRepository;
    @Mock private UserRepository userRepository;
    @Mock private ProductRepository productRepository;

    @InjectMocks
    private ReviewServiceImpl reviewService;

    @Test
    void createReview_whenUserHasNotPurchased_shouldThrowException() {
        // Arrange
        Long userId = 1L;
        ReviewRequest request = new ReviewRequest();
        request.setProductId(10);
        request.setRating(5);

        when(orderRepository.existsByUserIdAndProductIdAndStatus(userId.intValue(), request.getProductId(), "COMPLETED")).thenReturn(false);

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            reviewService.createReview(userId, request);
        });

        verify(reviewRepository, never()).save(any());
    }

    @Test
    void createReview_whenUserHasPurchased_shouldSucceed() {
        // Arrange
        Long userId = 1L;
        ReviewRequest request = new ReviewRequest();
        request.setProductId(10);
        request.setRating(5);

        User mockUser = User.builder().id(userId.intValue()).fullName("Test").build();
        Product mockProduct = Product.builder().id(10).build();

        when(orderRepository.existsByUserIdAndProductIdAndStatus(userId.intValue(), request.getProductId(), "COMPLETED")).thenReturn(true);
        when(reviewRepository.existsByUserIdAndProductId(userId.intValue(), request.getProductId())).thenReturn(false);
        when(userRepository.findById(userId.intValue())).thenReturn(Optional.of(mockUser));
        when(productRepository.findById(request.getProductId())).thenReturn(Optional.of(mockProduct));

        // Act
        reviewService.createReview(userId, request);

        // Assert
        verify(reviewRepository, times(1)).save(any());
    }
}
