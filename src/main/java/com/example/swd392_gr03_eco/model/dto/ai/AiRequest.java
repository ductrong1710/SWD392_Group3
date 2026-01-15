package com.example.swd392_gr03_eco.model.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.List;

@Data
@AllArgsConstructor
public class AiRequest {
    private String model;
    private List<Message> messages;
    private double temperature;

    @Data
    @AllArgsConstructor
    public static class Message {
        private String role;
        private String content;
    }
}
