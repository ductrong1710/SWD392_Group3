package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.sql.Timestamp;

@Data
@Builder
public class ReviewResponseDto {
    private Integer reviewId;
    private String userName;
    private int rating;
    private String comment;
    private Timestamp createdAt;
}
