package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;
import java.util.List;

@Data
public class ChatRequest {
    private String message;
    private List<Message> history;

    @Data
    public static class Message {
        private String role; // "user" or "assistant"
        private String content;
    }
}
