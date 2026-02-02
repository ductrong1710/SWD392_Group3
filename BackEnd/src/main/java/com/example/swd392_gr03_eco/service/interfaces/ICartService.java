package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.AddToCartRequest;
import com.example.swd392_gr03_eco.model.dto.request.UpdateCartItemRequest;
import com.example.swd392_gr03_eco.model.dto.response.CartResponse;
import com.example.swd392_gr03_eco.model.entities.User;

public interface ICartService {
    CartResponse getCartForUser(User user);
    CartResponse addItemToCart(User user, AddToCartRequest request);
    CartResponse updateItemInCart(User user, Integer orderItemId, UpdateCartItemRequest request);
    void removeItemFromCart(User user, Integer orderItemId);
}
