package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.LoginRequest;
import com.example.swd392_gr03_eco.model.dto.request.RegisterRequest;
import com.example.swd392_gr03_eco.model.dto.response.AuthResponse;

public interface IAuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
