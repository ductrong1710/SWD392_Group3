package com.example.swd392_gr03_eco.service.impl;

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
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.sql.Timestamp;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements IPaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final PaymentStrategyFactory strategyFactory;

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
    public void handlePaymentCallback(String paymentMethod, Map<String, String> params) {
        PaymentStrategy strategy = strategyFactory.getStrategy(paymentMethod)
                .orElseThrow(() -> new IllegalArgumentException("Unsupported payment method: " + paymentMethod));

        int result = strategy.handleCallback(params);
        
        String orderIdStr = getOrderIdFromParams(paymentMethod, params);
        if (orderIdStr == null) {
            throw new IllegalArgumentException("Order ID is missing from payment callback.");
        }
        
        Integer orderId = Integer.parseInt(orderIdStr);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new EntityNotFoundException("Order not found from callback: " + orderId));

        if (result == 0) { // SUCCESS
            order.setStatus("COMPLETED");
            updatePaymentStatus(order, "SUCCESS", params.toString());
        } else { // FAILURE or INVALID SIGNATURE
            order.setStatus("PAYMENT_FAILED");
            updatePaymentStatus(order, "FAILURE", params.toString());
            revertStock(order);
        }
        orderRepository.save(order);
    }

    private String getOrderIdFromParams(String paymentMethod, Map<String, String> params) {
        if ("VNPAY".equalsIgnoreCase(paymentMethod)) {
            return params.get("vnp_TxnRef");
        }
        if ("MOMO".equalsIgnoreCase(paymentMethod)) {
            String orderIdWithTimestamp = params.get("orderId");
            if (orderIdWithTimestamp != null && orderIdWithTimestamp.contains("_")) {
                return orderIdWithTimestamp.split("_")[0];
            }
            return orderIdWithTimestamp;
        }
        return null;
    }

    private void updatePaymentStatus(Order order, String status, String rawResponse) {
        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new EntityNotFoundException("Payment not found for order: " + order.getId()));
        payment.setStatus(status);
        payment.setRawResponseLog(rawResponse);
        if ("SUCCESS".equals(status)) {
            payment.setPaidAt(new Timestamp(System.currentTimeMillis()));
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
