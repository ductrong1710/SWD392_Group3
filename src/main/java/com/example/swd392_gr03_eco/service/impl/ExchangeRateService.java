package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.response.ExchangeRateResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@Slf4j
public class ExchangeRateService {

    @Value("${exchange-rate.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();
    private double vndToUsdRate = 25400; // Default fallback rate

    // Fetch the rate every 6 hours
    @Scheduled(fixedRate = 6 * 60 * 60 * 1000)
    public void fetchExchangeRate() {
        try {
            ExchangeRateResponseDto response = restTemplate.getForObject(apiUrl, ExchangeRateResponseDto.class);
            if (response != null && response.getConversionRates().containsKey("VND")) {
                this.vndToUsdRate = response.getConversionRates().get("VND");
                log.info("Successfully fetched new USD to VND exchange rate: {}", this.vndToUsdRate);
            }
        } catch (Exception e) {
            log.error("Could not fetch exchange rate. Using fallback rate {}. Error: {}", vndToUsdRate, e.getMessage());
        }
    }

    public BigDecimal convertUsdToVnd(BigDecimal usdAmount) {
        if (usdAmount == null) {
            return BigDecimal.ZERO;
        }
        BigDecimal rate = BigDecimal.valueOf(this.vndToUsdRate);
        // VNPAY requires an integer amount, so we round it to the nearest whole number.
        return usdAmount.multiply(rate).setScale(0, RoundingMode.HALF_UP);
    }
}
