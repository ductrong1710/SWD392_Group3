package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.ChatRequest;
import com.example.swd392_gr03_eco.model.dto.response.ChatResponse;

public interface IChatbotService {
    ChatResponse getStatelessReply(ChatRequest request);
}
