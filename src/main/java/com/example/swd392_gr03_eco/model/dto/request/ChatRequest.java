package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;

@Data
public class ChatRequest {
    private Integer sessionId; // Can be null for a new session
    private String message;
}
