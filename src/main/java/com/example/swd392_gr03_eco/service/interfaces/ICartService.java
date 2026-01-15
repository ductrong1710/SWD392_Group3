package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.CartItemRequest;
import com.example.swd392_gr03_eco.model.dto.response.CartDto;

public interface ICartService {
    CartDto getCart(Object sessionCart);
    CartDto addItem(Object sessionCart, CartItemRequest request);
    CartDto updateItem(Object sessionCart, CartItemRequest request);
    void removeItem(Object sessionCart, Integer productVariantId);
}
