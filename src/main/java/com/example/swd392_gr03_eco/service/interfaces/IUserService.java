package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.UserDto;
import com.example.swd392_gr03_eco.model.dto.response.UserResponseDto;

import java.util.List;

public interface IUserService {
    UserResponseDto getUserProfile(Integer userId);

    List<UserDto> getAllUsers();

    UserDto createUser(UserDto userDto);

    UserDto updateUser(Integer userId, UserDto userDto);

    void deleteUser(Integer userId);
}
