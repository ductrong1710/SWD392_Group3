package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.ChatRequest;
import com.example.swd392_gr03_eco.model.dto.response.ChatResponse;
import com.example.swd392_gr03_eco.service.interfaces.IChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/chatbot")
@RequiredArgsConstructor
public class ChatbotController {

    private final IChatbotService chatbotService;

    @PostMapping("/query")
    public ResponseEntity<ChatResponse> handleChat(@RequestBody ChatRequest request) {
        return ResponseEntity.ok(chatbotService.getStatelessReply(request));
    }
}
