package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.ai.AiRequest;
import com.example.swd392_gr03_eco.model.dto.ai.AiResponse;
import com.example.swd392_gr03_eco.model.dto.request.ChatMessageRequest;
import com.example.swd392_gr03_eco.model.dto.response.ChatResponse;
import com.example.swd392_gr03_eco.model.entities.*;
import com.example.swd392_gr03_eco.repositories.*;
import com.example.swd392_gr03_eco.service.interfaces.IChatbotService;
import com.example.swd392_gr03_eco.service.interfaces.IEmbeddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotServiceImpl implements IChatbotService {

    private final IEmbeddingService embeddingService;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.api.key}")
    private String apiKey;
    @Value("${ai.api.url}")
    private String apiUrl;
    @Value("${ai.model}")
    private String model;

    @Override
    @Transactional
    public ChatResponse startSession(Long userId, ChatMessageRequest request) {
        User user = userRepository.findById(userId.intValue()).orElseThrow(() -> new RuntimeException("User not found"));
        ChatSession session = ChatSession.builder()
                .user(user)
                .startedAt(new Timestamp(System.currentTimeMillis()))
                .build();
        session = chatSessionRepository.save(session);
        return processMessage(session, request.getMessage());
    }

    @Override
    @Transactional
    public ChatResponse continueSession(Long userId, Integer sessionId, ChatMessageRequest request) {
        User user = userRepository.findById(userId.intValue()).orElseThrow(() -> new RuntimeException("User not found"));
        ChatSession session = chatSessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Chat session not found"));
        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("User does not own this chat session");
        }
        return processMessage(session, request.getMessage());
    }

    private ChatResponse processMessage(ChatSession session, String userMessage) {
        // 1. Save user message
        saveMessage(session, "USER", userMessage);

        // 2. Find relevant products
        float[] queryEmbedding = embeddingService.getEmbedding(userMessage);
        List<Product> relevantProducts = productRepository.findNearestNeighbors(queryEmbedding, 5);

        // 3. Build prompt and call AI
        String botReply = callAi(session, relevantProducts, userMessage);

        // 4. Save bot message and update session
        saveMessage(session, "BOT", botReply);
        session.setContextSummary(botReply); // Simple context update
        chatSessionRepository.save(session);

        return ChatResponse.builder()
                .sessionId(session.getId())
                .botMessage(botReply)
                .build();
    }

    private void saveMessage(ChatSession session, String sender, String text) {
        ChatMessage message = ChatMessage.builder()
                .session(session)
                .sender(sender)
                .messageText(text)
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
        chatMessageRepository.save(message);
    }

    private String callAi(ChatSession session, List<Product> products, String userMessage) {
        List<AiRequest.Message> messages = new ArrayList<>();
        messages.add(new AiRequest.Message("system", "You are a helpful and friendly e-commerce assistant. Your goal is to help the user find the perfect product."));

        // Add conversation history
        chatMessageRepository.findBySessionIdOrderByCreatedAtAsc(session.getId())
                .forEach(msg -> messages.add(new AiRequest.Message(msg.getSender().toLowerCase(), msg.getMessageText())));

        // Add product context
        String productInfo = products.stream()
                .map(p -> String.format("- ID: %d, Name: %s, Description: %s, Price: %.2f",
                        p.getId(), p.getName(), p.getDescription(), p.getBasePrice()))
                .collect(Collectors.joining("\n"));

        String contextPrompt = String.format(
                "Based on the conversation history and the following potentially relevant products, answer the user's last message. " +
                "If the products seem relevant, recommend them. If not, ask for more details. Keep your answers concise and friendly.\n\n" +
                "--- Relevant Products ---\n%s\n\n",
                productInfo.isEmpty() ? "No specific products found." : productInfo
        );
        messages.add(new AiRequest.Message("user", contextPrompt + userMessage));


        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        AiRequest request = new AiRequest(model, messages, 0.7);
        HttpEntity<AiRequest> entity = new HttpEntity<>(request, headers);

        try {
            AiResponse response = restTemplate.postForObject(apiUrl, entity, AiResponse.class);
            if (response != null && !response.getChoices().isEmpty()) {
                return response.getChoices().get(0).getMessage().getContent().trim();
            }
        } catch (Exception e) {
            System.err.println("Error calling AI API: " + e.getMessage());
            return "I'm sorry, I'm having a little trouble right now. Please try again in a moment.";
        }
        return "I'm sorry, I couldn't generate a response.";
    }
}
