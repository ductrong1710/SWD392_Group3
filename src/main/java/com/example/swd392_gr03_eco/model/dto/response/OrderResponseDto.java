package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Data
@Builder
public class OrderResponseDto {
    private Integer orderId;
    private String status;
    private Timestamp orderDate;
    private String shippingAddressJson;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private List<OrderItemResponseDto> items;
    private String paymentMethod;
}
