package com.example.swd392_gr03_eco.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant; // Import Instant
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderResponseDto {
    private Integer orderId;
    private String status;
    private Instant orderDate; // Change to Instant
    private String shippingAddressJson;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private List<OrderItemResponseDto> items;
    private String paymentMethod;
}
