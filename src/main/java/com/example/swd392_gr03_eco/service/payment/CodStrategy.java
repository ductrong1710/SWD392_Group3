package com.example.swd392_gr03_eco.service.payment;

import com.example.swd392_gr03_eco.model.entities.Order;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component("COD")
public class CodStrategy implements PaymentStrategy {

    @Override
    public String createPaymentUrl(Order order, HttpServletRequest request) {
        order.setStatus("AWAITING_PAYMENT");
        return "/checkout-success?orderId=" + order.getId() + "&status=AWAITING_PAYMENT";
    }

    @Override
    public int handleCallback(Map<String, String> params) {
        // COD doesn't have a callback from a third party.
        // This method will not be used for COD flow.
        return 0; // Assume success
    }
}
