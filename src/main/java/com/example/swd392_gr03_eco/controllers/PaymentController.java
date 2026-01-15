package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.service.interfaces.IPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService paymentService;

    @GetMapping("/vnpay-callback")
    public ResponseEntity<String> handleVnpayCallback(@RequestParam Map<String, String> params) {
        try {
            paymentService.handleVnpayCallback(params);
            // In a real application, you would redirect to a success or failure page.
            return ResponseEntity.ok("Payment handled successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error handling payment: " + e.getMessage());
        }
    }
}
