package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductCreateRequest {
    private String name;
    private String description;
    private String brandName;
    private BigDecimal basePrice;
    
    // Add a list of images to be created with the product
    private List<ImageRequestDto> images;
    
    private List<VariantDTO> variants;

    @Data
    public static class VariantDTO {
        private String sku;
        private String color;
        private String size;
        private String material;
        private BigDecimal priceOverride;
        private Integer stockQuantity;
    }
}
