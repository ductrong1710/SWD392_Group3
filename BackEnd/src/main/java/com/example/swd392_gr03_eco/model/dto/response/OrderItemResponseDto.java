package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponseDto {
    private Integer productVariantId;
    private String productName;
    private String imageUrl;
    private String color;
    private String size;
    private int quantity;
    private BigDecimal priceAtPurchase;
}
