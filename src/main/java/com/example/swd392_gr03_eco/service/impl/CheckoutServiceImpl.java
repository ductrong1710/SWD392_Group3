package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.configs.VnpayConfig;
import com.example.swd392_gr03_eco.model.dto.request.CheckoutRequest;
import com.example.swd392_gr03_eco.model.dto.response.CartDto;
import com.example.swd392_gr03_eco.model.dto.response.PaymentResponse;
import com.example.swd392_gr03_eco.model.entities.Order;
import com.example.swd392_gr03_eco.model.entities.OrderItem;
import com.example.swd392_gr03_eco.model.entities.ProductVariant;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.repositories.ProductVariantRepository;
import com.example.swd392_gr03_eco.service.interfaces.ICartService;
import com.example.swd392_gr03_eco.service.interfaces.ICheckoutService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl implements ICheckoutService {

    private final ICartService cartService;
    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final VnpayConfig vnpayConfig;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public PaymentResponse checkout(Object sessionCart, CheckoutRequest request) {
        CartDto cart = cartService.getCart(sessionCart);
        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Create and save the order
        Order order = createOrder(cart, request);
        orderRepository.save(order);

        // Update stock
        updateStock(order);

        // Create payment URL if VNPAY
        if ("VNPAY".equalsIgnoreCase(request.getPaymentMethod())) {
            String paymentUrl = vnpayConfig.createPaymentUrl(
                    order.getFinalAmount().longValue(),
                    "Thanh toan don hang " + order.getId()
            );
            return PaymentResponse.builder().paymentUrl(paymentUrl).build();
        }

        return PaymentResponse.builder().paymentUrl(null).build(); // For COD
    }

    private Order createOrder(CartDto cart, CheckoutRequest request) {
        Order order = new Order();
        // Assuming user is authenticated, otherwise handle anonymous user
        // order.setUser(user);
        order.setTotalAmount(cart.getTotalPrice());
        order.setDiscountAmount(BigDecimal.ZERO); // Handle discount later
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

        return order;
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
}
