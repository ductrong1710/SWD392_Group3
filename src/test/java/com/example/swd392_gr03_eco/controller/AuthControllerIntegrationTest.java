package com.example.swd392_gr03_eco.controller;

import com.example.swd392_gr03_eco.model.dto.request.RegisterRequest;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.hamcrest.Matchers.notNullValue;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class AuthControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        // @Transactional ensures the database is clean before each test
    }

    @Test
    @DisplayName("TC1: API Register Success - Should create user and return token with valid data")
    void register_withValidData_shouldCreateUserAndReturnToken() throws Exception {
        // Arrange
        RegisterRequest registerRequest = new RegisterRequest("New Customer", "customer123@example.com", "password123", "1234567890");

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.token").value(notNullValue()));

        // Verify database state
        assertTrue(userRepository.findByEmail("customer123@example.com").isPresent());
        System.out.println("PASSED - TC1: API Register Success");
    }

    @Test
    @DisplayName("TC2: API Register Fail - Should return Bad Request when email already exists")
    void register_withExistingEmail_shouldReturnBadRequest() throws Exception {
        // Arrange
        // First, create a user so the email exists
        RegisterRequest initialRequest = new RegisterRequest("Existing User", "existing@example.com", "password123", "111222333");
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(initialRequest)));

        // Now, try to register with the same email
        RegisterRequest duplicateRequest = new RegisterRequest("Another User", "existing@example.com", "password456", "444555666");

        // Act & Assert
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(duplicateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Email already in use"));
        System.out.println("PASSED - TC2: API Register Fail (Email exists)");
    }
}
