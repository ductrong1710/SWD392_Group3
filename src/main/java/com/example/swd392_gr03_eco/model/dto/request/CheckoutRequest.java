package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;

@Data
public class CheckoutRequest {
    private String fullName;
    private String phone;
    private String address;
    private String city;
    private String paymentMethod; // e.g., "COD", "VNPAY"
    private String note;
}
