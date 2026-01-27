package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.ai.AiRequest;
import com.example.swd392_gr03_eco.model.dto.ai.AiResponse;
import com.example.swd392_gr03_eco.model.dto.request.ChatRequest;
import com.example.swd392_gr03_eco.model.dto.response.ChatResponse;
import com.example.swd392_gr03_eco.model.entities.Product;
import com.example.swd392_gr03_eco.repositories.ProductRepository;
import com.example.swd392_gr03_eco.service.interfaces.IChatbotService;
import com.example.swd392_gr03_eco.service.interfaces.IEmbeddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatbotServiceImpl implements IChatbotService {

    private final IEmbeddingService embeddingService;
    private final ProductRepository productRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.api.key}")
    private String apiKey;
    @Value("${ai.api.url}")
    private String apiUrl;
    @Value("${ai.model}")
    private String model;

    @Override
    public ChatResponse getStatelessReply(ChatRequest request) {
        String userMessage = request.getMessage();

        // 1. Find relevant products based on the latest user message
        float[] queryEmbedding = embeddingService.getEmbedding(userMessage);
        List<Product> relevantProducts = productRepository.findNearestNeighbors(queryEmbedding, 5);

        // 2. Build prompt and call AI
        String botReply = callAi(request.getHistory(), relevantProducts, userMessage);

        // 3. Return the response
        return ChatResponse.builder()
                .botMessage(botReply)
                .build();
    }

    private String callAi(List<ChatRequest.Message> history, List<Product> products, String userMessage) {
        List<AiRequest.Message> messages = new ArrayList<>();
        messages.add(new AiRequest.Message("system", "You are a helpful and friendly e-commerce assistant. Your goal is to help the user find the perfect product."));

        // Add conversation history from the request
        if (history != null) {
            history.forEach(msg -> messages.add(new AiRequest.Message(msg.getRole(), msg.getContent())));
        }

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
        
        // Add the latest user message with the context
        messages.add(new AiRequest.Message("user", contextPrompt + userMessage));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        AiRequest aiRequest = new AiRequest(model, messages, 0.7);
        HttpEntity<AiRequest> entity = new HttpEntity<>(aiRequest, headers);

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
