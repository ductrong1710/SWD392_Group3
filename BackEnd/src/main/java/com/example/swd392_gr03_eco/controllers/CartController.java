package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.AddToCartRequest;
import com.example.swd392_gr03_eco.model.dto.request.UpdateCartItemRequest;
import com.example.swd392_gr03_eco.model.dto.response.CartResponse;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.service.interfaces.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final ICartService cartService;

    @GetMapping
    public ResponseEntity<CartResponse> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(cartService.getCartForUser(user));
    }

    @PostMapping("/items")
    public ResponseEntity<CartResponse> addItemToCart(@AuthenticationPrincipal User user, @RequestBody AddToCartRequest request) {
        CartResponse updatedCart = cartService.addItemToCart(user, request);
        return new ResponseEntity<>(updatedCart, HttpStatus.CREATED);
    }

    @PutMapping("/items/{orderItemId}")
    public ResponseEntity<CartResponse> updateCartItem(@AuthenticationPrincipal User user, @PathVariable Integer orderItemId, @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateItemInCart(user, orderItemId, request));
    }

    @DeleteMapping("/items/{orderItemId}")
    public ResponseEntity<Void> removeCartItem(@AuthenticationPrincipal User user, @PathVariable Integer orderItemId) {
        cartService.removeItemFromCart(user, orderItemId);
        return ResponseEntity.noContent().build();
    }
}
