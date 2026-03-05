package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.UserDto;
import com.example.swd392_gr03_eco.model.dto.response.UserResponseDto;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import com.example.swd392_gr03_eco.service.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;

    @Override
    public UserResponseDto getUserProfile(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return mapUserToResponseDto(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream().map(this::mapUserToUserDto).collect(Collectors.toList());
    }

    @Override
    public UserDto createUser(UserDto userDto) {
        User user = mapUserDtoToUser(userDto);
        // Set default values or perform validation as needed
        return mapUserToUserDto(userRepository.save(user));
    }

    @Override
    public UserDto updateUser(Integer userId, UserDto userDto) {
        User existingUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        existingUser.setFullName(userDto.getFullName());
        existingUser.setEmail(userDto.getEmail());
        existingUser.setPhone(userDto.getPhone());
        // Update other fields as necessary
        return mapUserToUserDto(userRepository.save(existingUser));
    }

    @Override
    public void deleteUser(Integer userId) {
        userRepository.deleteById(userId);
    }

    private UserResponseDto mapUserToResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .build();
    }

    private UserDto mapUserToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setUserId(user.getId());
        userDto.setFullName(user.getFullName());
        userDto.setEmail(user.getEmail());
        userDto.setPhone(user.getPhone());
        // Map other fields as necessary
        return userDto;
    }

    private User mapUserDtoToUser(UserDto userDto) {
        User user = new User();
        user.setFullName(userDto.getFullName());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());
        // Map other fields as necessary
        return user;
    }
}
