package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.AddressRequestDto;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.service.interfaces.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()") // All methods require a logged-in user
public class UserController {

    private final IUserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getUserProfile(user.getId()));
    }

    @PostMapping("/addresses")
    public ResponseEntity<?> addAddress(@AuthenticationPrincipal User user, @RequestBody AddressRequestDto request) {
        return ResponseEntity.ok(userService.addAddress(user.getId(), request));
    }

    @PutMapping("/addresses/{addressId}")
    public ResponseEntity<?> updateAddress(@AuthenticationPrincipal User user, @PathVariable Integer addressId, @RequestBody AddressRequestDto request) {
        return ResponseEntity.ok(userService.updateAddress(user.getId(), addressId, request));
    }

    @DeleteMapping("/addresses/{addressId}")
    public ResponseEntity<?> deleteAddress(@AuthenticationPrincipal User user, @PathVariable Integer addressId) {
        userService.deleteAddress(user.getId(), addressId);
        return ResponseEntity.noContent().build();
    }
}
