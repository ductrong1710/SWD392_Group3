package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;

@Data
public class ImageRequestDto {
    private String imageUrl;
    private Boolean isThumbnail;
    private String color; // Optional: to link image with a color variant
}
