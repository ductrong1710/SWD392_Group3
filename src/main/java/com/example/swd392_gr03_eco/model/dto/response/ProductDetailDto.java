package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
public class ProductDetailDto {
    private Integer id;
    private String name;
    private String description;
    private String brandName;
    private BigDecimal basePrice;
    private Boolean isActive;
    private Instant createdAt;
    private CategoryDto category;
    private List<ProductImageDto> productImages;
    private List<ProductVariantDto> productVariants;
}
