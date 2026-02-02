package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class UserResponseDto {
    private Integer id;
    private String fullName;
    private String email;
    private String phone;
    private List<AddressResponseDto> addresses;
}
