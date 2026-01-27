package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;

@Data
public class ReviewRequest {
    private Integer orderItemId;
    private int rating; // 1-5
    private String comment;
}
