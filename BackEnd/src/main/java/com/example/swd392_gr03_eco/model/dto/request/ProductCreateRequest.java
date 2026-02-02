package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductCreateRequest {
    private String name;
    private String description;
    private String brandName; // Added this field
    private BigDecimal basePrice; // Changed from Double to BigDecimal
    private List<VariantDTO> variants;

    @Data
    public static class VariantDTO {
        private String sku;
        private String color;
        private String size;
        private BigDecimal priceOverride; // Changed from Double to BigDecimal
        private Integer stockQuantity;
        private String material;
    }
}
