package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.AddToCartRequest;
import com.example.swd392_gr03_eco.model.dto.request.UpdateCartItemRequest;
import com.example.swd392_gr03_eco.model.dto.response.CartResponse;
import com.example.swd392_gr03_eco.model.entities.Order;
import com.example.swd392_gr03_eco.model.entities.OrderItem;
import com.example.swd392_gr03_eco.model.entities.ProductImage;
import com.example.swd392_gr03_eco.model.entities.ProductVariant;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.repositories.OrderItemRepository;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.repositories.ProductVariantRepository;
import com.example.swd392_gr03_eco.service.interfaces.ICartService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements ICartService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductVariantRepository productVariantRepository;

    @Override
    @Transactional(readOnly = true)
    public CartResponse getCartForUser(User user) {
        Order cart = findCartByUser(user).orElse(createEmptyCart(user));
        return mapOrderToCartResponse(cart);
    }

    @Override
    @Transactional
    public CartResponse addItemToCart(User user, AddToCartRequest request) {
        if (request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be positive.");
        }

        Order cart = findOrCreateCart(user);
        ProductVariant variant = productVariantRepository.findById(request.getProductVariantId())
                .orElseThrow(() -> new EntityNotFoundException("Product variant not found"));

        if (variant.getStockQuantity() < request.getQuantity()) {
            throw new IllegalStateException("Not enough stock for product: " + variant.getProduct().getName());
        }

        Optional<OrderItem> existingItem = cart.getOrderItems().stream()
                .filter(item -> item.getProductVariant().getId().equals(request.getProductVariantId()))
                .findFirst();

        if (existingItem.isPresent()) {
            OrderItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            orderItemRepository.save(item);
        } else {
            OrderItem newItem = OrderItem.builder()
                    .order(cart)
                    .productVariant(variant)
                    .quantity(request.getQuantity())
                    .priceAtPurchase(variant.getProduct().getBasePrice()) // Or priceOverride if exists
                    .build();
            cart.getOrderItems().add(newItem);
            orderItemRepository.save(newItem);
        }

        return mapOrderToCartResponse(orderRepository.save(cart));
    }

    @Override
    @Transactional
    public CartResponse updateItemInCart(User user, Integer orderItemId, UpdateCartItemRequest request) {
        if (request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be positive.");
        }

        Order cart = findCartByUser(user).orElseThrow(() -> new EntityNotFoundException("Cart not found"));
        OrderItem itemToUpdate = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new EntityNotFoundException("Order item not found"));

        if (!itemToUpdate.getOrder().getId().equals(cart.getId())) {
            throw new SecurityException("Order item does not belong to the user's cart.");
        }

        if (itemToUpdate.getProductVariant().getStockQuantity() < request.getQuantity()) {
            throw new IllegalStateException("Not enough stock.");
        }

        itemToUpdate.setQuantity(request.getQuantity());
        orderItemRepository.save(itemToUpdate);

        return mapOrderToCartResponse(cart);
    }

    @Override
    @Transactional
    public void removeItemFromCart(User user, Integer orderItemId) {
        Order cart = findCartByUser(user).orElseThrow(() -> new EntityNotFoundException("Cart not found"));
        OrderItem itemToRemove = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new EntityNotFoundException("Order item not found"));

        if (!itemToRemove.getOrder().getId().equals(cart.getId())) {
            throw new SecurityException("Order item does not belong to the user's cart.");
        }

        orderItemRepository.delete(itemToRemove);
    }

    private Order findOrCreateCart(User user) {
        return findCartByUser(user).orElseGet(() -> {
            Order newCart = Order.builder()
                    .user(user)
                    .status("CART")
                    .orderItems(new ArrayList<>())
                    .build();
            return orderRepository.save(newCart);
        });
    }

    private Optional<Order> findCartByUser(User user) {
        return orderRepository.findByUserIdAndStatus(user.getId(), "CART");
    }
    
    private Order createEmptyCart(User user) {
        return Order.builder()
            .user(user)
            .status("CART")
            .orderItems(new ArrayList<>())
            .totalAmount(BigDecimal.ZERO)
            .build();
    }

    private CartResponse mapOrderToCartResponse(Order order) {
        List<CartResponse.CartItemResponse> itemResponses = order.getOrderItems().stream()
                .map(this::mapOrderItemToCartItemResponse)
                .collect(Collectors.toList());

        BigDecimal totalAmount = itemResponses.stream()
                .map(CartResponse.CartItemResponse::getItemTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Persist the calculated total amount to the order
        order.setTotalAmount(totalAmount);
        orderRepository.save(order);

        return CartResponse.builder()
                .orderId(order.getId())
                .status(order.getStatus())
                .items(itemResponses)
                .totalAmount(totalAmount)
                .build();
    }

    private CartResponse.CartItemResponse mapOrderItemToCartItemResponse(OrderItem item) {
        ProductVariant variant = item.getProductVariant();
        String imageUrl = variant.getProduct().getProductImages().stream()
                .filter(img -> img.getIsThumbnail() != null && img.getIsThumbnail())
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(variant.getProduct().getProductImages().isEmpty() ? null : variant.getProduct().getProductImages().get(0).getImageUrl());

        return CartResponse.CartItemResponse.builder()
                .orderItemId(item.getId())
                .productVariantId(variant.getId())
                .productName(variant.getProduct().getName())
                .variantInfo(String.format("%s, %s", variant.getColor(), variant.getSize()))
                .imageUrl(imageUrl)
                .price(item.getPriceAtPurchase())
                .quantity(item.getQuantity())
                .itemTotal(item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity())))
                .build();
    }
}
