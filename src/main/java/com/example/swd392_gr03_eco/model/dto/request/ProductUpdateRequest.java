package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class ProductUpdateRequest {
    private String name;
    private String description;
    private String brandName;
    private BigDecimal basePrice;
    private Integer categoryId;
    private Boolean isActive;
    // Note: Variant and image updates would typically be handled by their own dedicated endpoints
    // e.g., POST /api/v1/products/{id}/variants
}
