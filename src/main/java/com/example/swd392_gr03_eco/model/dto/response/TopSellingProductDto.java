package com.example.swd392_gr03_eco.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopSellingProductDto {
    private Integer productId;
    private String productName;
    private Long totalQuantitySold;
}
