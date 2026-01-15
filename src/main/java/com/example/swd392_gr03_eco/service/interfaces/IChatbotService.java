package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.ChatMessageRequest;
import com.example.swd392_gr03_eco.model.dto.response.ChatResponse;

public interface IChatbotService {
    ChatResponse startSession(Long userId, ChatMessageRequest request);
    ChatResponse continueSession(Long userId, Integer sessionId, ChatMessageRequest request);
}
