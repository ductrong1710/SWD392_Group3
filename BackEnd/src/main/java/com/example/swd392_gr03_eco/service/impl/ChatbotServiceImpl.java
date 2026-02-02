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
    @Transactional(readOnly = true) // Add Transactional to allow lazy loading of variants
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
        // --- NEW: Build a much more detailed context string ---
        String productContext;
        if (products.isEmpty()) {
            productContext = "Không tìm thấy sản phẩm nào phù hợp trong kho.";
        } else {
            StringBuilder contextBuilder = new StringBuilder();
            for (Product p : products) {
                contextBuilder.append(String.format("- Tên sản phẩm: %s | Hãng: %s | Giá gốc: %s\n",
                        p.getName(), p.getBrandName(), p.getBasePrice()));

                if (p.getProductVariants() == null || p.getProductVariants().isEmpty()) {
                    contextBuilder.append("  + Sản phẩm này chưa có biến thể (màu sắc, kích cỡ).\n");
                } else {
                    contextBuilder.append("  + Các loại hiện có:\n");
                    for (ProductVariant v : p.getProductVariants()) {
                        BigDecimal finalPrice = v.getPriceOverride() != null ? v.getPriceOverride() : p.getBasePrice();
                        contextBuilder.append(String.format("    - Màu: %s, Cỡ: %s, Chất liệu: %s, Giá: %s, Tồn kho: %d\n",
                                v.getColor(), v.getSize(), v.getMaterial(), finalPrice, v.getStockQuantity()));
                    }
                }
            }
            productContext = contextBuilder.toString();
        }

        String systemPrompt = """
                Bạn là một trợ lý bán hàng thông minh và thân thiện của một cửa hàng thời trang.
                Dưới đây là thông tin chi tiết về các sản phẩm liên quan đến câu hỏi của khách hàng:
                ---
                %s
                ---
                Nhiệm vụ của bạn:
                1. Dựa vào thông tin trên để trả lời câu hỏi của khách hàng một cách chính xác.
                2. Trả lời các câu hỏi về màu sắc, kích cỡ, giá tiền, số lượng tồn kho.
                3. Nếu khách hàng hỏi một thông tin không có (ví dụ: màu không có trong danh sách), hãy trả lời là "hiện tại shop chưa có màu đó" và gợi ý các màu đang có.
                4. Nếu tồn kho (stock) bằng 0, hãy thông báo là "sản phẩm này đang tạm hết hàng".
                5. Luôn trả lời một cách tự nhiên, lịch sự và ngắn gọn.
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
