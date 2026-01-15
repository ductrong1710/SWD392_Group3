package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.AddressRequestDto;
import com.example.swd392_gr03_eco.model.dto.response.AddressResponseDto;
import com.example.swd392_gr03_eco.model.dto.response.UserResponseDto;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.model.entities.UserAddress;
import com.example.swd392_gr03_eco.repositories.UserAddressRepository;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import com.example.swd392_gr03_eco.service.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final UserAddressRepository userAddressRepository;

    @Override
    public UserResponseDto getUserProfile(Integer userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return mapUserToDto(user);
    }

    @Override
    @Transactional
    public UserResponseDto addAddress(Integer userId, AddressRequestDto request) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        UserAddress address = UserAddress.builder()
                .user(user)
                .addressLine(request.getAddressLine())
                .city(request.getCity())
                .isDefault(request.getIsDefault())
                .build();
        userAddressRepository.save(address);
        return mapUserToDto(user);
    }

    @Override
    @Transactional
    public UserResponseDto updateAddress(Integer userId, Integer addressId, AddressRequestDto request) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        if (!address.getUser().getId().equals(userId)) {
            throw new SecurityException("User does not own this address");
        }
        address.setAddressLine(request.getAddressLine());
        address.setCity(request.getCity());
        address.setIsDefault(request.getIsDefault());
        userAddressRepository.save(address);
        return mapUserToDto(address.getUser());
    }

    @Override
    @Transactional
    public void deleteAddress(Integer userId, Integer addressId) {
        UserAddress address = userAddressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));
        if (!address.getUser().getId().equals(userId)) {
            throw new SecurityException("User does not own this address");
        }
        userAddressRepository.delete(address);
    }

    private UserResponseDto mapUserToDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .addresses(user.getAddresses().stream().map(this::mapAddressToDto).collect(Collectors.toList()))
                .build();
    }

    private AddressResponseDto mapAddressToDto(UserAddress address) {
        return AddressResponseDto.builder()
                .id(address.getId())
                .addressLine(address.getAddressLine())
                .city(address.getCity())
                .isDefault(address.getIsDefault())
                .build();
    }
}
