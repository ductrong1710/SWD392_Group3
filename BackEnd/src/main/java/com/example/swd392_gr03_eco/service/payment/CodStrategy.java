package com.example.swd392_gr03_eco.service.payment;

import com.example.swd392_gr03_eco.model.entities.Order;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component("COD")
public class CodStrategy implements PaymentStrategy {

    @Override
    public String createPaymentUrl(Order order, HttpServletRequest request) {
        // For COD, we don't need an external payment URL.
        // We can return a success URL directly to our frontend.
        // The frontend will know that it doesn't need to redirect.
        return "/checkout-success?orderId=" + order.getId() + "&status=SUCCESS";
    }

    @Override
    public int handleCallback(Map<String, String> params) {
        // COD doesn't have a callback from a third party.
        // This method will not be used for COD flow.
        return 0; // Assume success
    }
}
