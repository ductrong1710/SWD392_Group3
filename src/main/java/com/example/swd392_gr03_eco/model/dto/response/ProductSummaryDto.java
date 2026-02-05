package com.example.swd392_gr03_eco.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryDto {
    private Integer id;
    private String name;
    private BigDecimal price;
    private String brandName;
    private String thumbnailUrl;
}
