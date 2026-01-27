package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.CheckoutRequest;
import com.example.swd392_gr03_eco.model.dto.response.CheckoutResponse;
import com.example.swd392_gr03_eco.model.entities.*;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.repositories.PaymentRepository;
import com.example.swd392_gr03_eco.repositories.ProductVariantRepository;
import com.example.swd392_gr03_eco.service.interfaces.ICheckoutService;
import com.example.swd392_gr03_eco.service.interfaces.IPaymentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class CheckoutServiceImpl implements ICheckoutService {

    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final PaymentRepository paymentRepository;
    private final IPaymentService paymentService;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public CheckoutResponse processCheckout(User user, CheckoutRequest request) {
        Order cart = orderRepository.findByUserIdAndStatus(user.getId(), "CART")
                .orElseThrow(() -> new IllegalStateException("Cart is empty."));

        if (cart.getOrderItems().isEmpty()) {
            throw new IllegalStateException("Cannot checkout with an empty cart.");
        }

        for (OrderItem item : cart.getOrderItems()) {
            ProductVariant variant = productVariantRepository.findById(item.getProductVariant().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Product variant not found during checkout."));

            if (variant.getStockQuantity() < item.getQuantity()) {
                throw new IllegalStateException("Not enough stock for product: " + variant.getProduct().getName());
            }
            variant.setStockQuantity(variant.getStockQuantity() - item.getQuantity());
            productVariantRepository.save(variant);
        }

        try {
            String addressJson = objectMapper.writeValueAsString(request.getShippingAddress());
            cart.setShippingAddressJson(addressJson);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize shipping address.", e);
        }
        
        cart.setFinalAmount(cart.getTotalAmount());
        
        // Special handling for COD
        if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {
            cart.setStatus("COMPLETED"); // Or "PROCESSING" if you have a shipping step
            Order completedOrder = orderRepository.save(cart);

            Payment payment = Payment.builder()
                .order(completedOrder)
                .user(user)
                .method("COD")
                .status("SUCCESS")
                .paidAt(new Timestamp(System.currentTimeMillis()))
                .build();
            paymentRepository.save(payment);

            return CheckoutResponse.builder()
                .paymentUrl("/checkout-success?orderId=" + completedOrder.getId() + "&status=SUCCESS") // No external URL needed
                .orderId(completedOrder.getId())
                .build();
        }

        // For other methods like VNPAY
        cart.setStatus("AWAITING_PAYMENT");
        Order processingOrder = orderRepository.save(cart);
        String paymentUrl = paymentService.createPayment(processingOrder, request.getPaymentMethod());

        return CheckoutResponse.builder()
                .paymentUrl(paymentUrl)
                .orderId(processingOrder.getId())
                .build();
    }
}
