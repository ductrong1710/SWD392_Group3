package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.ChatMessageRequest;
import com.example.swd392_gr03_eco.service.interfaces.IChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chat-sessions")
@RequiredArgsConstructor
public class ChatbotController {

    private final IChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<?> startChatSession(@RequestBody ChatMessageRequest request) {
        // Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Long userId = 1L; // Placeholder
        try {
            var result = chatbotService.startSession(userId, request);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{sessionId}/messages")
    public ResponseEntity<?> postMessage(@PathVariable Integer sessionId, @RequestBody ChatMessageRequest request) {
        // Long userId = ((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getId();
        Long userId = 1L; // Placeholder
        try {
            var result = chatbotService.continueSession(userId, sessionId, request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
