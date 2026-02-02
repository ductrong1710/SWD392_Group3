package com.example.swd392_gr03_eco.service.payment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Optional;

@Component
public class PaymentStrategyFactory {

    private final Map<String, PaymentStrategy> strategyMap;

    @Autowired
    public PaymentStrategyFactory(Map<String, PaymentStrategy> strategyMap) {
        this.strategyMap = strategyMap;
    }

    public Optional<PaymentStrategy> getStrategy(String paymentMethod) {
        return Optional.ofNullable(strategyMap.get(paymentMethod.toUpperCase()));
    }
}
