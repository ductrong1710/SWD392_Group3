package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;

@Data
public class CheckoutRequest {
    private AddressInfo shippingAddress;
    private String paymentMethod; // e.g., "VNPAY", "MOMO", "COD"

    @Data
    public static class AddressInfo {
        private String fullName;
        private String phone;
        private String addressLine;
        private String city;
        // Add other fields like district, ward if needed
    }
}
