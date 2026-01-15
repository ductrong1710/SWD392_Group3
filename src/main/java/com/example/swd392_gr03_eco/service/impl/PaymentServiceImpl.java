package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.configs.VnpayConfig;
import com.example.swd392_gr03_eco.model.entities.Order;
import com.example.swd392_gr03_eco.model.entities.Payment;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.repositories.PaymentRepository;
import com.example.swd392_gr03_eco.service.interfaces.IPaymentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements IPaymentService {

    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final VnpayConfig vnpayConfig;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void handleVnpayCallback(Map<String, String> params) {
        String vnp_SecureHash = params.remove("vnp_SecureHash");

        // Build the sorted data string for hashing
        String hashDataString = params.entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(entry -> URLDecoder.decode(entry.getKey(), StandardCharsets.US_ASCII) + "=" + URLDecoder.decode(entry.getValue(), StandardCharsets.US_ASCII))
                .collect(Collectors.joining("&"));

        String calculatedHash = VnpayConfig.hmacSHA512(vnpayConfig.getVnpHashSecret(), hashDataString);

        if (!calculatedHash.equals(vnp_SecureHash)) {
            throw new RuntimeException("Invalid VNPAY signature");
        }

        // Extract orderId from vnp_TxnRef, which is more reliable
        String txnRef = params.get("vnp_TxnRef");
        // Assuming the format is "orderId_timestamp" or just orderId
        int orderId = Integer.parseInt(txnRef.split("_")[0]);

        String responseCode = params.get("vnp_ResponseCode");

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        // Avoid creating duplicate payments for the same order
        if (paymentRepository.existsByOrderId(orderId)) {
             // Optionally log this attempt
             return;
        }

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setMethod("VNPAY");
        payment.setTransactionCode(params.get("vnp_TransactionNo"));
        try {
            payment.setRawResponseLog(objectMapper.writeValueAsString(params));
        } catch (JsonProcessingException e) {
            // ignore
        }
        payment.setPaidAt(new Timestamp(System.currentTimeMillis()));

        if ("00".equals(responseCode)) {
            order.setStatus("PAID");
            payment.setStatus("SUCCESS");
        } else {
            order.setStatus("PAYMENT_FAILED");
            payment.setStatus("FAILED");
            // In a real-world scenario, you should implement a mechanism to revert stock quantity here.
        }
        orderRepository.save(order);
        paymentRepository.save(payment);
    }
}
