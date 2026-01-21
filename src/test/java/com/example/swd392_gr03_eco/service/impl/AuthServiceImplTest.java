package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.RegisterRequest;
import com.example.swd392_gr03_eco.model.dto.response.AuthResponse;
import com.example.swd392_gr03_eco.model.entities.Role;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.repositories.RoleRepository;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import com.example.swd392_gr03_eco.repositories.UserRoleRepository;
import com.example.swd392_gr03_eco.service.jwt.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private RoleRepository roleRepository;
    @Mock private UserRoleRepository userRoleRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    @Test
    @DisplayName("TC1: Register Success - Should create user and return token when email is new")
    void register_whenEmailIsNew_shouldCreateUserAndReturnToken() {
        // Arrange
        RegisterRequest request = new RegisterRequest("Test User", "test@example.com", "password123", "0123456789");
        Role customerRole = Role.builder().id(2).roleName("CUSTOMER").build();
        String dummyToken = "dummy-jwt-token";

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.getPassword())).thenReturn("encodedPassword");
        when(roleRepository.findByRoleName("CUSTOMER")).thenReturn(Optional.of(customerRole));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken(any(User.class))).thenReturn(dummyToken);

        // Act
        AuthResponse response = authService.register(request);

        // Assert
        assertNotNull(response);
        assertEquals(dummyToken, response.getToken());
        System.out.println("PASSED - TC1: Register Success");

        verify(userRepository, times(1)).findByEmail("test@example.com");
        verify(passwordEncoder, times(1)).encode("password123");
        verify(userRepository, times(1)).save(any(User.class));
        verify(userRoleRepository, times(1)).save(any());
        verify(jwtService, times(1)).generateToken(any(User.class));
    }

    @Test
    @DisplayName("TC2: Register Fail - Should throw exception when email already exists")
    void register_whenEmailAlreadyExists_shouldThrowException() {
        // Arrange
        RegisterRequest request = new RegisterRequest("Test User", "test@example.com", "password123", "0123456789");
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(new User()));

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            authService.register(request);
        });

        assertEquals("Email already in use", exception.getMessage());
        System.out.println("PASSED - TC2: Register Fail (Email exists)");

        verify(userRepository, never()).save(any());
    }
}
