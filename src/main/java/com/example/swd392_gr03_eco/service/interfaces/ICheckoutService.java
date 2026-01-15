package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.CheckoutRequest;
import com.example.swd392_gr03_eco.model.dto.response.PaymentResponse;

public interface ICheckoutService {
    PaymentResponse checkout(Object sessionCart, CheckoutRequest request);
}
