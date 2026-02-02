package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.ai.AiRequest;
import com.example.swd392_gr03_eco.model.dto.ai.AiResponse;
import com.example.swd392_gr03_eco.model.entities.Category;
import com.example.swd392_gr03_eco.repositories.CategoryRepository;
import com.example.swd392_gr03_eco.service.interfaces.IAiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements IAiService {

    private final CategoryRepository categoryRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.api.url}")
    private String apiUrl;

    @Value("${ai.model}")
    private String model;

    @Override
    public String classifyProduct(String productName, String productDescription) {
        List<Category> categories = categoryRepository.findAll();
        String categoryNames = categories.stream().map(Category::getName).collect(Collectors.joining(", "));

        String prompt = String.format(
                "Based on the following product information, which of these categories is the most suitable? The categories are: [%s]. " +
                "Product Name: \"%s\". " +
                "Description: \"%s\". " +
                "Please respond with only the single most appropriate category name from the list.",
                categoryNames, productName, productDescription
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        AiRequest.Message message = new AiRequest.Message("user", prompt);
        AiRequest request = new AiRequest(model, List.of(message), 0.5);

        HttpEntity<AiRequest> entity = new HttpEntity<>(request, headers);

        try {
            AiResponse response = restTemplate.postForObject(apiUrl, entity, AiResponse.class);
            if (response != null && !response.getChoices().isEmpty()) {
                return response.getChoices().get(0).getMessage().getContent().trim();
            }
        } catch (Exception e) {
            // Log the error, and maybe fall back to a default category
            System.err.println("Error calling AI API: " + e.getMessage());
        }
        return "Uncategorized"; // Fallback category
    }
}
