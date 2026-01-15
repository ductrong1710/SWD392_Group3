package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class CartItemDto {
    private Integer productVariantId;
    private String productName;
    private String color;
    private String size;
    private BigDecimal price;
    private int quantity;
    private String imageUrl;
}
