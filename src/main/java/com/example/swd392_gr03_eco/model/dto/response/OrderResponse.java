package com.example.swd392_gr03_eco.model.dto.response;

import com.example.swd392_gr03_eco.model.dto.request.CheckoutRequest;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Data
@Builder
public class OrderResponse {
    private Integer orderId;
    private String status;
    private Timestamp orderDate;
    private CheckoutRequest.AddressInfo shippingAddress;
    private List<OrderItemResponse> items;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String paymentMethod;

    @Data
    @Builder
    public static class OrderItemResponse {
        private Integer productVariantId;
        private String productName;
        private String variantInfo;
        private String imageUrl;
        private int quantity;
        private BigDecimal priceAtPurchase;
        private BigDecimal itemTotal;
    }
}
