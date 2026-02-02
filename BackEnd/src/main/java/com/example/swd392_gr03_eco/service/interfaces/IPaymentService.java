package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.entities.Order;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

public interface IPaymentService {
    String createPayment(Order order, String paymentMethod);
    void handlePaymentCallback(String paymentMethod, Map<String, String> params);
}
