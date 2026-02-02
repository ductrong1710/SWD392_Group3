package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.service.interfaces.IPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService paymentService;

    // Callback for VNPAY (and others that use GET)
    @GetMapping("/{paymentMethod}/callback")
    public ResponseEntity<String> handleGetCallback(
            @PathVariable String paymentMethod,
            @RequestParam Map<String, String> allParams) {
        
        paymentService.handlePaymentCallback(paymentMethod, allParams);
        
        // This should ideally redirect to a frontend page
        return ResponseEntity.ok("Payment callback received. Your order status will be updated.");
    }

    // IPN for MoMo (and others that use POST)
    @PostMapping("/{paymentMethod}/ipn")
    public ResponseEntity<Void> handlePostIpn(
            @PathVariable String paymentMethod,
            @RequestBody Map<String, String> allParams) {
        
        paymentService.handlePaymentCallback(paymentMethod, allParams);
        
        // Acknowledge receipt to MoMo
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
