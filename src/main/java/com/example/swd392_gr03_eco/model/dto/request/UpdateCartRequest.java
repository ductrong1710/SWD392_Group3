package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;

@Data
public class UpdateCartRequest {
    private Integer productVariantId;
    private int quantity;
}
