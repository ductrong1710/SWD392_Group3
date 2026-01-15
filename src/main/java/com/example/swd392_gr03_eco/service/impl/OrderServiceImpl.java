package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.configs.VnpayConfig;
import com.example.swd392_gr03_eco.model.dto.request.OrderRequest;
import com.example.swd392_gr03_eco.model.dto.response.CartDto;
import com.example.swd392_gr03_eco.model.dto.response.OrderItemResponseDto;
import com.example.swd392_gr03_eco.model.dto.response.OrderResponseDto;
import com.example.swd392_gr03_eco.model.dto.response.PaymentResponse;
import com.example.swd392_gr03_eco.model.entities.*;
import com.example.swd392_gr03_eco.repositories.*;
import com.example.swd392_gr03_eco.service.interfaces.ICartService;
import com.example.swd392_gr03_eco.service.interfaces.IOrderService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final ICartService cartService;
    private final VnpayConfig vnpayConfig;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public PaymentResponse createOrder(Long userId, Object sessionCart, OrderRequest request) {
        User user = userRepository.findById(userId.intValue()).orElseThrow(() -> new RuntimeException("User not found"));
        CartDto cart = cartService.getCart(sessionCart);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setTotalAmount(cart.getTotalPrice());
        order.setDiscountAmount(BigDecimal.ZERO);
        order.setFinalAmount(cart.getTotalPrice());
        order.setStatus("PENDING");
        order.setCreatedAt(new Timestamp(System.currentTimeMillis()));

        try {
            order.setShippingAddressJson(objectMapper.writeValueAsString(request));
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Error processing shipping address", e);
        }

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            ProductVariant variant = productVariantRepository.findById(cartItem.getProductVariantId())
                    .orElseThrow(() -> new RuntimeException("Product variant not found"));
            item.setProductVariant(variant);
            item.setQuantity(cartItem.getQuantity());
            item.setPriceAtPurchase(cartItem.getPrice());
            return item;
        }).collect(Collectors.toList());
        order.setOrderItems(orderItems);

        orderRepository.save(order);
        updateStock(order);

        if ("VNPAY".equalsIgnoreCase(request.getPaymentMethod())) {
            String paymentUrl = vnpayConfig.createPaymentUrl(
                    order.getFinalAmount().longValue(),
                    "Thanh toan don hang " + order.getId()
            );
            return PaymentResponse.builder().paymentUrl(paymentUrl).build();
        }

        return PaymentResponse.builder().paymentUrl(null).build();
    }

    private void updateStock(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            ProductVariant variant = item.getProductVariant();
            int newStock = variant.getStockQuantity() - item.getQuantity();
            if (newStock < 0) {
                throw new RuntimeException("Not enough stock for product " + variant.getProduct().getName());
            }
            variant.setStockQuantity(newStock);
            productVariantRepository.save(variant);
        }
    }

    @Override
    public List<OrderResponseDto> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId.intValue()).stream()
                .map(this::mapOrderToDto)
                .collect(Collectors.toList());
    }

    @Override
    public OrderResponseDto getOrderDetails(Integer orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId.intValue())
                .orElseThrow(() -> new RuntimeException("Order not found or you don't have permission"));
        return mapOrderToDto(order);
    }

    @Override
    @Transactional
    public void cancelOrder(Integer orderId, Long userId) {
        Order order = orderRepository.findByIdAndUserId(orderId, userId.intValue())
                .orElseThrow(() -> new RuntimeException("Order not found or you don't have permission"));

        if (!"PENDING".equals(order.getStatus()) && !"PAID".equals(order.getStatus())) {
            throw new RuntimeException("Cannot cancel order with status: " + order.getStatus());
        }

        order.setStatus("CANCELLED");
        for (OrderItem item : order.getOrderItems()) {
            ProductVariant variant = item.getProductVariant();
            variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
            productVariantRepository.save(variant);
        }
        orderRepository.save(order);
    }

    @Override
    public List<OrderResponseDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::mapOrderToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void updateOrderStatus(Integer orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        orderRepository.save(order);
    }

    private OrderResponseDto mapOrderToDto(Order order) {
        List<OrderItemResponseDto> itemDtos = order.getOrderItems().stream()
                .map(this::mapOrderItemToDto)
                .collect(Collectors.toList());

        String paymentMethod = order.getPayments().stream()
                .findFirst()
                .map(Payment::getMethod)
                .orElse("COD");

        return OrderResponseDto.builder()
                .orderId(order.getId())
                .status(order.getStatus())
                .orderDate(order.getCreatedAt())
                .shippingAddressJson(order.getShippingAddressJson())
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .finalAmount(order.getFinalAmount())
                .items(itemDtos)
                .paymentMethod(paymentMethod)
                .build();
    }

    private OrderItemResponseDto mapOrderItemToDto(OrderItem item) {
        ProductVariant variant = item.getProductVariant();
        String imageUrl = variant.getProduct().getProductImages().stream()
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElse(null);

        return OrderItemResponseDto.builder()
                .productVariantId(variant.getId())
                .productName(variant.getProduct().getName())
                .imageUrl(imageUrl)
                .color(variant.getColor())
                .size(variant.getSize())
                .quantity(item.getQuantity())
                .priceAtPurchase(item.getPriceAtPurchase())
                .build();
    }
}
