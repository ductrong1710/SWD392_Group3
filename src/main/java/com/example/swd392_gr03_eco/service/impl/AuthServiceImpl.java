package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.LoginRequest;
import com.example.swd392_gr03_eco.model.dto.request.RegisterRequest;
import com.example.swd392_gr03_eco.model.dto.response.AuthResponse;
import com.example.swd392_gr03_eco.model.entities.Role;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.repositories.RoleRepository;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import com.example.swd392_gr03_eco.service.interfaces.IAuthService;
import com.example.swd392_gr03_eco.service.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository; // Không cần UserRoleRepository nữa
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // 1. Check Email trùng
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already in use");
        }

        // 2. Lấy Role Customer từ DB trước
        Role customerRole = roleRepository.findByRoleName("CUSTOMER")
                .orElseThrow(() -> new IllegalStateException("CUSTOMER role not found. Please run seed data."));

        // 3. Tạo User và gán Role trực tiếp
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .isActive(true)
                .role(customerRole) // <--- QUAN TRỌNG: Gán role thẳng vào đây
                .build();

        // 4. Lưu User (Hibernate sẽ tự lấy ID của Role để điền vào cột role_id)
        User savedUser = userRepository.save(user);

        // 5. Tạo Token
        String jwtToken = jwtService.generateToken(savedUser);
        return AuthResponse.builder().token(jwtToken).build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        // Hàm này giữ nguyên, vì AuthenticationManager sẽ dùng UserDetails.getAuthorities()
        // mà bạn đã cập nhật trong entity User để trả về role duy nhất.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        String jwtToken = jwtService.generateToken(user);
        return AuthResponse.builder().token(jwtToken).build();
    }
}