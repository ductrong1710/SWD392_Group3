package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.CheckoutRequest;
import com.example.swd392_gr03_eco.model.dto.response.CheckoutResponse;
import com.example.swd392_gr03_eco.model.entities.User;

public interface ICheckoutService {
    CheckoutResponse processCheckout(User user, CheckoutRequest request);
}
