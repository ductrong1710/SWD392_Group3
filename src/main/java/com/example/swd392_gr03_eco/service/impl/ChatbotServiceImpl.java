package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.ai.AiRequest;
import com.example.swd392_gr03_eco.model.dto.ai.AiResponse;
import com.example.swd392_gr03_eco.model.dto.request.ChatRequest;
import com.example.swd392_gr03_eco.model.dto.response.ChatResponse;
import com.example.swd392_gr03_eco.model.entities.Product;
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
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
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
    public ChatResponse getStatelessReply(User user, ChatRequest request) {
        try {
            String userMessage = request.getMessage();

            Embedding embedding = embeddingModel.embed(userMessage).content();
            float[] vector = embedding.vector();
            String vectorString = IntStream.range(0, vector.length)
                                         .mapToObj(i -> String.valueOf(vector[i]))
                                         .collect(Collectors.joining(",", "[", "]"));

            List<Product> relevantProducts = productRepository.findNearestNeighbors(vectorString, 5);

            String botReply = callAi(user, request.getHistory(), relevantProducts, userMessage);

            return ChatResponse.builder().botMessage(botReply).build();
        } catch (Exception e) {
            e.printStackTrace();
            return ChatResponse.builder().botMessage("Lỗi hệ thống: " + e.getMessage()).build();
        }
    }

    private String callAi(User user, List<ChatRequest.Message> history, List<Product> products, String userMessage) {
        String productContext = products.isEmpty()
                ? "Không tìm thấy sản phẩm nào phù hợp trong kho."
                : products.stream()
                .map(p -> String.format("- Tên: %s | Giá: %s | Mô tả: %s",
                        p.getName(), p.getBasePrice(), p.getDescription()))
                .collect(Collectors.joining("\n"));

        String systemPrompt = """
                Bạn là nhân viên tư vấn bán hàng nhiệt tình và chuyên nghiệp.
                Dưới đây là danh sách sản phẩm liên quan tìm được từ kho:
                %s
                
                Hãy dùng thông tin trên để trả lời câu hỏi của khách hàng.
                Nếu không có sản phẩm nào phù hợp, hãy gợi ý khách hàng hỏi về chủ đề khác.
                Chỉ trả lời dựa trên thông tin được cung cấp.
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
                .temperature(0.7)
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
            System.err.println("Lỗi gọi AI API: " + e.getMessage());
            return "Xin lỗi, tôi đang gặp sự cố khi kết nối với bộ não AI. Vui lòng thử lại sau.";
        }
        return "Xin lỗi, tôi không có câu trả lời cho vấn đề này.";
    }
}
