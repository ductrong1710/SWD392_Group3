package com.example.swd392_gr03_eco.model.dto;

import lombok.Data;

@Data
public class UserDto {
    private Integer userId;
    private String fullName;
    private String email;
    private String phone;
    private String password; // Include for creation, but be careful with exposure
}
