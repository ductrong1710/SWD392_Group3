package com.example.swd392_gr03_eco.service.interfaces;

import java.util.Map;

public interface IPaymentService {
    void handleVnpayCallback(Map<String, String> params);
}
