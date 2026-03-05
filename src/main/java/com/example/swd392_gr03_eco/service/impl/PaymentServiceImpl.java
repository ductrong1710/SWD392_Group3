package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.VnpayCallbackDto;
import com.example.swd392_gr03_eco.model.dto.response.PaymentVerificationResponse;
import com.example.swd392_gr03_eco.model.entities.Order;
import com.example.swd392_gr03_eco.model.entities.OrderItem;
import com.example.swd392_gr03_eco.model.entities.Payment;
import com.example.swd392_gr03_eco.model.entities.ProductVariant;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.repositories.PaymentRepository;
import com.example.swd392_gr03_eco.repositories.ProductVariantRepository;
import com.example.swd392_gr03_eco.service.interfaces.IPaymentService;
import com.example.swd392_gr03_eco.service.payment.PaymentStrategy;
import com.example.swd392_gr03_eco.service.payment.PaymentStrategyFactory;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final PaymentStrategyFactory strategyFactory;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public String createPayment(Order order, String paymentMethod) {
        PaymentStrategy strategy = strategyFactory.getStrategy(paymentMethod)
                .orElseThrow(() -> new IllegalArgumentException("Unsupported payment method: " + paymentMethod));

        Payment payment = Payment.builder()
                .order(order)
                .user(order.getUser())
                .method(paymentMethod)
                .status("PENDING")
                .build();
        paymentRepository.save(payment);

        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
        return strategy.createPaymentUrl(order, request);
    }

    @Override
    @Transactional
    public PaymentVerificationResponse verifyVnpayPayment(VnpayCallbackDto callbackDto) {
        PaymentStrategy strategy = strategyFactory.getStrategy("VNPAY")
                .orElseThrow(() -> new IllegalStateException("VNPAY strategy not found"));

        Map<String, String> params = objectMapper.convertValue(callbackDto, new TypeReference<>() {});
        
        int result = strategy.handleCallback(params);
        
        // --- CRITICAL FIX: Extract original order ID from the unique transaction reference ---
        String vnp_TxnRef = callbackDto.getVnpTxnRef();
        if (vnp_TxnRef == null || vnp_TxnRef.isEmpty()) {
            throw new IllegalArgumentException("Transaction reference is missing from VNPAY callback.");
        }
        String[] refParts = vnp_TxnRef.split("_");
        Integer orderId = Integer.parseInt(refParts[0]);
        // ------------------------------------------------------------------------------------

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found from callback: " + orderId));

        if (result == 0) { // SUCCESS
            order.setStatus("COMPLETED");
            updatePaymentStatus(order, "SUCCESS", params.toString());
            orderRepository.save(order);
            return PaymentVerificationResponse.builder()
                    .success(true)
                    .message("Payment completed successfully!")
                    .orderId(orderId)
                    .build();
        } else { // FAILURE or INVALID SIGNATURE
            order.setStatus("PAYMENT_FAILED");
            updatePaymentStatus(order, "FAILURE", params.toString());
            revertStock(order);
            orderRepository.save(order);
            return PaymentVerificationResponse.builder()
                    .success(false)
                    .message("Payment failed or signature is invalid.")
                    .orderId(orderId)
                    .build();
        }
    }

    private void updatePaymentStatus(Order order, String status, String rawResponse) {
        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new EntityNotFoundException("Payment not found for order: " + order.getId()));
        payment.setStatus(status);
        payment.setRawResponseLog(rawResponse);
        if ("SUCCESS".equals(status)) {
            payment.setPaidAt(Instant.now());
        }
        paymentRepository.save(payment);
    }

    private void revertStock(Order order) {
        for (OrderItem item : order.getOrderItems()) {
            ProductVariant variant = item.getProductVariant();
            variant.setStockQuantity(variant.getStockQuantity() + item.getQuantity());
            productVariantRepository.save(variant);
        }
    }
}
