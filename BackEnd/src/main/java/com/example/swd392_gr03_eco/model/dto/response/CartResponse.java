package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class CartResponse {
    private Integer orderId;
    private String status;
    private List<CartItemResponse> items;
    private BigDecimal totalAmount;

    @Data
    @Builder
    public static class CartItemResponse {
        private Integer orderItemId;
        private Integer productVariantId;
        private String productName;
        private String variantInfo; // e.g., "Red, M"
        private String imageUrl;
        private BigDecimal price;
        private int quantity;
        private BigDecimal itemTotal;
    }
}
