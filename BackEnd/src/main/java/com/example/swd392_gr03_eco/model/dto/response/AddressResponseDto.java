package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressResponseDto {
    private Integer id;
    private String addressLine;
    private String city;
    private Boolean isDefault;
}
