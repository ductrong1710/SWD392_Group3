package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.VnpayCallbackDto;
import com.example.swd392_gr03_eco.model.dto.response.PaymentVerificationResponse;
import com.example.swd392_gr03_eco.model.entities.Order;

public interface IPaymentService {
    String createPayment(Order order, String paymentMethod);
    PaymentVerificationResponse verifyVnpayPayment(VnpayCallbackDto callbackDto);
}
