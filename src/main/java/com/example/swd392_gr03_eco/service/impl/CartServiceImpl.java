package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.CartItemRequest;
import com.example.swd392_gr03_eco.model.dto.response.CartDto;
import com.example.swd392_gr03_eco.model.dto.response.CartItemDto;
import com.example.swd392_gr03_eco.model.entities.ProductVariant;
import com.example.swd392_gr03_eco.repositories.ProductVariantRepository;
import com.example.swd392_gr03_eco.service.interfaces.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {

    private final ProductVariantRepository productVariantRepository;

    @Override
    public CartDto getCart(Object sessionCart) {
        Map<Integer, CartItemDto> cart = castSessionCart(sessionCart);
        return buildCartDto(cart);
    }

    @Override
    public CartDto addItem(Object sessionCart, CartItemRequest request) {
        Map<Integer, CartItemDto> cart = castSessionCart(sessionCart);
        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new RuntimeException("Product variant not found"));

        CartItemDto item = cart.get(variant.getId());
        if (item != null) {
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            item = CartItemDto.builder()
                    .productVariantId(variant.getId())
                    .productName(variant.getProduct().getName())
                    .color(variant.getColor())
                    .size(variant.getSize())
                    .price(variant.getPriceOverride() != null ? variant.getPriceOverride() : variant.getProduct().getBasePrice())
                    .quantity(request.getQuantity())
                    .imageUrl(variant.getProduct().getProductImages().stream().findFirst().map(pi -> pi.getImageUrl()).orElse(null))
                    .build();
            cart.put(variant.getId(), item);
        }
        return buildCartDto(cart);
    }

    @Override
    public CartDto updateItem(Object sessionCart, CartItemRequest request) {
        Map<Integer, CartItemDto> cart = castSessionCart(sessionCart);
        CartItemDto item = cart.get(request.getProductVariantId());
        if (item != null) {
            if (request.getQuantity() > 0) {
                item.setQuantity(request.getQuantity());
            } else {
                cart.remove(request.getProductVariantId());
            }
        }
        return buildCartDto(cart);
    }

    @Override
    public void removeItem(Object sessionCart, Integer productVariantId) {
        Map<Integer, CartItemDto> cart = castSessionCart(sessionCart);
        cart.remove(productVariantId);
    }

    private Map<Integer, CartItemDto> castSessionCart(Object sessionCart) {
        if (sessionCart instanceof Map) {
            return (Map<Integer, CartItemDto>) sessionCart;
        }
        return new HashMap<>();
    }

    private CartDto buildCartDto(Map<Integer, CartItemDto> cart) {
        List<CartItemDto> items = new ArrayList<>(cart.values());
        BigDecimal totalPrice = items.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartDto.builder()
                .items(items)
                .totalPrice(totalPrice)
                .build();
    }
}
