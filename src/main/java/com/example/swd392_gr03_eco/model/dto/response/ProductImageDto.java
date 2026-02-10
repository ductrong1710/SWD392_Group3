package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Data;

@Data
public class ProductImageDto {
    private Integer id;
    private String imageUrl;
    private Boolean isThumbnail;
}
