package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.ai.AiRequest;
import com.example.swd392_gr03_eco.model.dto.ai.AiResponse;
import com.example.swd392_gr03_eco.model.dto.request.ChatRequest;
import com.example.swd392_gr03_eco.model.dto.response.ChatResponse;
import com.example.swd392_gr03_eco.model.entities.Product;
import com.example.swd392_gr03_eco.model.entities.ProductVariant;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.repositories.ProductRepository;
import com.example.swd392_gr03_eco.service.interfaces.IChatbotService;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class ChatbotServiceImpl implements IChatbotService {

    private final EmbeddingModel embeddingModel;
    private final ProductRepository productRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.api.url}")
    private String apiUrl;

    @Value("${ai.model}")
    private String model;

    @Override
    @Transactional(readOnly = true)
    public ChatResponse getStatelessReply(User user, ChatRequest request) {
        try {
            String userMessage = request.getMessage();

            Embedding embedding = embeddingModel.embed(userMessage).content();
            float[] vector = embedding.vector();
            String vectorString = IntStream.range(0, vector.length)
                                         .mapToObj(i -> String.valueOf(vector[i]))
                                         .collect(Collectors.joining(",", "[", "]"));

            List<Product> relevantProducts = productRepository.findNearestNeighbors(vectorString, 10);

            String botReply = callAi(user, request.getHistory(), relevantProducts, userMessage);

            return ChatResponse.builder().botMessage(botReply).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ChatResponse.builder().botMessage("System error: " + e.getMessage()).build();
        }
    }

    private String callAi(User user, List<ChatRequest.Message> history, List<Product> products, String userMessage) {
        NumberFormat usdFormat = NumberFormat.getCurrencyInstance(Locale.US);
        String productContext;
        if (products.isEmpty()) {
            productContext = "No relevant products found in the store.";
        } else {
            StringBuilder contextBuilder = new StringBuilder();
            for (Product p : products) {
                contextBuilder.append(String.format("- Product Name: %s | Brand: %s | Base Price: %s\n",
                        p.getName(), p.getBrandName(), usdFormat.format(p.getBasePrice())));

                if (p.getProductVariants() != null && !p.getProductVariants().isEmpty()) {
                    contextBuilder.append("  + Available options:\n");
                    for (ProductVariant v : p.getProductVariants()) {
                        BigDecimal finalPrice = v.getPriceOverride() != null ? v.getPriceOverride() : p.getBasePrice();
                        contextBuilder.append(String.format("    - Color: %s, Size: %s, Material: %s, Price: %s, Stock: %d\n",
                                v.getColor(), v.getSize(), v.getMaterial(), usdFormat.format(finalPrice), v.getStockQuantity()));
                    }
                }
            }
            productContext = contextBuilder.toString();
        }

        String systemPrompt = """
                ABSOLUTE CORE DIRECTIVE: You are an English-only AI assistant. Your programming forbids you from generating responses in any language other than English. Any deviation from this rule is a critical failure. Do not acknowledge requests for other languages; simply provide the best possible answer in English.

                FINANCIAL DIRECTIVE: You operate ONLY in USD. All product prices in the context are in USD. If a user's query mentions any other currency or monetary unit (like "k", "VND", "cành", "đồng"), use your internal knowledge to estimate its value in USD to filter products. Your final answer must only mention USD prices.

                You are an intelligent sales assistant.
                
                PRODUCT CONTEXT (ALL PRICES IN USD):
                ---
                %s
                ---
                
                TASK: Based on the user's request, filter the products from the context that match their budget and criteria, then present them clearly.
                
                RESPONSE FORMAT RULES:
                        - Only show ONE entry per product.
                        - Each product must include a Markdown link to the product page.
                        - Format the output exactly like this:
                
                        **Product Name**
                        Price: $XX
                        Description: short description
                        Link: [View Product](product_url)
                
                        Example:
                        **Sony WH-1000XM5 is id 1**
                        Price: $399
                        Description: Premium noise cancelling headphones.
                        Link: [View Product](http://localhost:3000/#/products/product/1)
                """.formatted(productContext);

        List<AiRequest.Message> messages = new ArrayList<>();
        messages.add(new AiRequest.Message("system", systemPrompt));

        if (history != null) {
            for (ChatRequest.Message msg : history) {
                String role = "bot".equalsIgnoreCase(msg.getRole()) ? "assistant" : "user";
                messages.add(new AiRequest.Message(role, msg.getContent()));
            }
        }
        messages.add(new AiRequest.Message("user", userMessage));

        AiRequest aiRequest = AiRequest.builder()
                .model(model)
                .messages(messages)
                .temperature(0.1) // Lower temperature even more for strict rule-following
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (!apiUrl.contains("goog")) {
            headers.setBearerAuth(apiKey);
        }

        try {
            String finalUrl = apiUrl.contains("goog") ? apiUrl + "?key=" + apiKey : apiUrl;
            HttpEntity<AiRequest> entity = new HttpEntity<>(aiRequest, headers);
            AiResponse response = restTemplate.postForObject(finalUrl, entity, AiResponse.class);

            if (response != null && !response.getChoices().isEmpty()) {
                return response.getChoices().get(0).getMessage().getContent();
            }
        } catch (Exception e) {
            System.err.println("AI API call error: " + e.getMessage());
            return "Sorry, I'm having trouble connecting to the AI brain. Please try again later.";
        }
        return "Sorry, I don't have an answer for that.";
    }
}
