package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.VnpayCallbackDto;
import com.example.swd392_gr03_eco.model.dto.response.PaymentVerificationResponse;
import com.example.swd392_gr03_eco.service.interfaces.IPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final IPaymentService paymentService;

    /**
     * New endpoint for frontend to verify payment after being redirected from VNPAY.
     * The frontend sends the callback parameters it received in the URL to this endpoint.
     * @param callbackDto DTO containing all vnp_ parameters.
     * @return A response indicating if the payment was successful.
     */
    @PostMapping("/verify-vnpay")
    public ResponseEntity<PaymentVerificationResponse> verifyVnpayPayment(@RequestBody VnpayCallbackDto callbackDto) {
        PaymentVerificationResponse response = paymentService.verifyVnpayPayment(callbackDto);
        return ResponseEntity.ok(response);
    }
}
