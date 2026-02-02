package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;

@Data
public class AddToCartRequest {
    private Integer productVariantId;
    private int quantity;
}
