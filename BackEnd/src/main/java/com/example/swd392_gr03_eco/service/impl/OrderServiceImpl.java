package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.CheckoutRequest;
import com.example.swd392_gr03_eco.model.dto.response.OrderResponse;
import com.example.swd392_gr03_eco.model.entities.*;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.repositories.ProductVariantRepository;
import com.example.swd392_gr03_eco.service.interfaces.IOrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(User user) {
        // Exclude 'CART' status from user's order history
        return orderRepository.findByUserId(user.getId()).stream()
                .filter(order -> !"CART".equals(order.getStatus()))
                .map(this::mapOrderToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getMyOrderDetails(User user, Integer orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found or you do not have permission to view it."));
        
        if ("CART".equals(order.getStatus())) {
            throw new SecurityException("This is a cart, not a placed order.");
        }
        
        return mapOrderToResponse(order);
    }

    @Override
    @Transactional
    public void cancelMyOrder(User user, Integer orderId) {
        Order order = orderRepository.findByIdAndUserId(orderId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Order not found or you do not have permission to cancel it."));

        // Define which statuses are cancellable by the user
        List<String> cancellableStatuses = Arrays.asList("AWAITING_PAYMENT", "PENDING");
        if (!cancellableStatuses.contains(order.getStatus())) {
            throw new IllegalStateException("Order cannot be cancelled with status: " + order.getStatus());
        }

        order.setStatus("CANCELLED");
        revertStock(order);
        orderRepository.save(order);
    }

    private void revertStock(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            ProductVariant variant = item.getProductVariant();
            variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
            productVariantRepository.save(variant);
        }
    }

    private OrderResponse mapOrderToResponse(Order order) {
        List<OrderResponse.OrderItemResponse> itemResponses = order.getOrderItems().stream()
                .map(this::mapOrderItemToResponse)
                .collect(Collectors.toList());

        String paymentMethod = order.getPayments().stream()
                .findFirst()
                .map(Payment::getMethod)
                .orElse(null);

        return OrderResponse.builder()
                .orderId(order.getId())
                .status(order.getStatus())
                .orderDate(order.getCreatedAt())
                .shippingAddress(parseShippingAddress(order.getShippingAddressJson()))
                .items(itemResponses)
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .paymentMethod(paymentMethod)
                .build();
    }

    private OrderResponse.OrderItemResponse mapOrderItemToResponse(OrderItem item) {
        ProductVariant variant = item.getProductVariant();
        String imageUrl = variant.getProduct().getProductImages().stream()
                .filter(img -> img.getIsThumbnail() != null && img.getIsThumbnail())
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(variant.getProduct().getProductImages().isEmpty() ? null : variant.getProduct().getProductImages().get(0).getImageUrl());

        return OrderResponse.OrderItemResponse.builder()
                .productVariantId(variant.getId())
                .productName(variant.getProduct().getName())
                .variantInfo(String.format("%s, %s", variant.getColor(), variant.getSize()))
                .imageUrl(imageUrl)
                .quantity(item.getQuantity())
                .priceAtPurchase(item.getPriceAtPurchase())
                .itemTotal(item.getPriceAtPurchase().multiply(BigDecimal.valueOf(item.getQuantity())))
                .build();
    }

    private CheckoutRequest.AddressInfo parseShippingAddress(String json) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            return objectMapper.readValue(json, CheckoutRequest.AddressInfo.class);
        } catch (Exception e) {
            return null;
        }
    }
}
