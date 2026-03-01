package com.example.swd392_gr03_eco.model.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.util.Map;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class ExchangeRateResponseDto {
    @JsonProperty("conversion_rates")
    private Map<String, Double> conversionRates;
}
