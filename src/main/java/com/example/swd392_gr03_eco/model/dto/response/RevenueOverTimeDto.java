package com.example.swd392_gr03_eco.model.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class RevenueOverTimeDto {
    private LocalDate date;
    private BigDecimal revenue;
}
