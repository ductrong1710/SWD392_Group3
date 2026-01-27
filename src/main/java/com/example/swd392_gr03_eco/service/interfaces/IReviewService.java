package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.ReviewRequest;
import com.example.swd392_gr03_eco.model.dto.response.ReviewResponseDto;

import java.util.List;

public interface IReviewService {
    ReviewResponseDto createReview(Long userId, ReviewRequest request);
    List<ReviewResponseDto> getReviewsByOrderItemId(Integer orderItemId);
}
