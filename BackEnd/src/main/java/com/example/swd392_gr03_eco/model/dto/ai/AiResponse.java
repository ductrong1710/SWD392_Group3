package com.example.swd392_gr03_eco.model.dto.ai;

import lombok.Data;
import java.util.List;

@Data
public class AiResponse {
    private List<Choice> choices;

    @Data
    public static class Choice {
        private Message message;
    }

    @Data
    public static class Message {
        private String content;
    }
}
