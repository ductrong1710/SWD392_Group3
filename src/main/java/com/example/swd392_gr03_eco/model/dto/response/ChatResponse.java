package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ChatResponse {
    private Integer sessionId;
    private String botMessage;
}
