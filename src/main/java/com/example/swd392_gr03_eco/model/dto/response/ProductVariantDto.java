package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductVariantDto {
    private Integer id;
    private String sku;
    private String color;
    private String size;
    private String material;
    private BigDecimal priceOverride;
    private Integer stockQuantity;
}
