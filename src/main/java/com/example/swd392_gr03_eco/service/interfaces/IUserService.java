package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.AddressRequestDto;
import com.example.swd392_gr03_eco.model.dto.response.UserResponseDto;

public interface IUserService {
    UserResponseDto getUserProfile(Integer userId);
    UserResponseDto addAddress(Integer userId, AddressRequestDto request);
    UserResponseDto updateAddress(Integer userId, Integer addressId, AddressRequestDto request);
    void deleteAddress(Integer userId, Integer addressId);
}
