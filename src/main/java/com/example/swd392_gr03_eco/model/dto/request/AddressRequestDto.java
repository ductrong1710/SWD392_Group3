package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;

@Data
public class AddressRequestDto {
    private String addressLine;
    private String city;
    private Boolean isDefault;
}
