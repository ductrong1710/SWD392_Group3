package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PaymentVerificationResponse {
    private boolean success;
    private String message;
    private Integer orderId;
}
