package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.ChatMessageRequest;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.service.interfaces.IChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/chat-sessions")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class ChatbotController {

    private final IChatbotService chatbotService;

    @PostMapping
    public ResponseEntity<?> startChatSession(@AuthenticationPrincipal User user, @RequestBody ChatMessageRequest request) {
        try {
            var result = chatbotService.startSession(user.getId().longValue(), request);
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{sessionId}/messages")
    public ResponseEntity<?> postMessage(@AuthenticationPrincipal User user, @PathVariable Integer sessionId, @RequestBody ChatMessageRequest request) {
        try {
            var result = chatbotService.continueSession(user.getId().longValue(), sessionId, request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
