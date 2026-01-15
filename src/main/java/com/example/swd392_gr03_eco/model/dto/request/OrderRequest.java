package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    // User info will be taken from security context, not from request body
    // private Long userId;
    
    // Shipping info
    private String fullName;
    private String phone;
    private String address;
    private String city;
    private String note;

    // Payment info
    private String paymentMethod; // e.g., "COD", "VNPAY"

    // Cart items are now handled by the session, so we don't need them here.
    // The service will get the cart from the session.
    // private List<CartItem> items; 

    // @Data
    // public static class CartItem {
    //     private Long variantId;
    //     private Integer quantity;
    // }
}
