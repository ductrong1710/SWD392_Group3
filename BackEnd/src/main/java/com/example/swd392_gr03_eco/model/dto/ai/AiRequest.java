package com.example.swd392_gr03_eco.model.dto.ai;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder // <--- Cái này giúp sửa lỗi .builder()
@AllArgsConstructor
@NoArgsConstructor
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
