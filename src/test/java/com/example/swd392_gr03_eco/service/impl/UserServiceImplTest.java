package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.AddressRequestDto;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.model.entities.UserAddress;
import com.example.swd392_gr03_eco.repositories.UserAddressRepository;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private UserAddressRepository userAddressRepository;

    @InjectMocks
    private UserServiceImpl userService;

    @Test
    void addAddress_whenUserExists_shouldSaveAddress() {
        // Arrange
        Integer userId = 1;
        AddressRequestDto request = new AddressRequestDto();
        request.setAddressLine("123 New Address");
        request.setCity("New City");

        User mockUser = User.builder().id(userId).addresses(new ArrayList<>()).build();
        when(userRepository.findById(userId)).thenReturn(Optional.of(mockUser));

        // Act
        userService.addAddress(userId, request);

        // Assert
        verify(userAddressRepository, times(1)).save(any(UserAddress.class));
    }

    @Test
    void deleteAddress_whenUserOwnsAddress_shouldDelete() {
        // Arrange
        Integer userId = 1;
        Integer addressId = 10;
        User mockUser = User.builder().id(userId).build();
        UserAddress mockAddress = UserAddress.builder().id(addressId).user(mockUser).build();

        when(userAddressRepository.findById(addressId)).thenReturn(Optional.of(mockAddress));

        // Act
        userService.deleteAddress(userId, addressId);

        // Assert
        verify(userAddressRepository, times(1)).delete(mockAddress);
    }

    @Test
    void deleteAddress_whenUserDoesNotOwnAddress_shouldThrowException() {
        // Arrange
        Integer ownerId = 1;
        Integer attackerId = 2;
        Integer addressId = 10;
        User ownerUser = User.builder().id(ownerId).build();
        UserAddress mockAddress = UserAddress.builder().id(addressId).user(ownerUser).build();

        when(userAddressRepository.findById(addressId)).thenReturn(Optional.of(mockAddress));

        // Act & Assert
        assertThrows(SecurityException.class, () -> {
            userService.deleteAddress(attackerId, addressId);
        });

        verify(userAddressRepository, never()).delete(any());
    }
}
