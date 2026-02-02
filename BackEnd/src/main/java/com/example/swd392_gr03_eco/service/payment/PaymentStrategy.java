package com.example.swd392_gr03_eco.service.payment;

import com.example.swd392_gr03_eco.model.entities.Order;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

public interface PaymentStrategy {
    String createPaymentUrl(Order order, HttpServletRequest request);
    int handleCallback(Map<String, String> params);
}
