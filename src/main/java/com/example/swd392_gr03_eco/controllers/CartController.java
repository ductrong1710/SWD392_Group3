package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.CartItemRequest;
import com.example.swd392_gr03_eco.service.interfaces.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()") // All methods require authentication
public class CartController {

    private final ICartService cartService;

    @GetMapping
    public ResponseEntity<?> getCart(@SessionAttribute(name = "cart", required = false) Object cart) {
        return ResponseEntity.ok(cartService.getCart(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<?> addItemToCart(@RequestBody CartItemRequest request, @SessionAttribute(name = "cart", required = false) Object cart) {
        var updatedCart = cartService.addItem(cart, request);
        return new ResponseEntity<>(updatedCart, HttpStatus.CREATED);
    }

    @PutMapping("/items/{productVariantId}")
    public ResponseEntity<?> updateCartItem(@PathVariable Integer productVariantId, @RequestBody CartItemRequest request, @SessionAttribute(name = "cart", required = false) Object cart) {
        request.setProductVariantId(productVariantId);
        return ResponseEntity.ok(cartService.updateItem(cart, request));
    }

    @DeleteMapping("/items/{productVariantId}")
    public ResponseEntity<?> removeCartItem(@PathVariable Integer productVariantId, @SessionAttribute(name = "cart", required = false) Object cart) {
        cartService.removeItem(cart, productVariantId);
        return ResponseEntity.noContent().build();
    }
}
