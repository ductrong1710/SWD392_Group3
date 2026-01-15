package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.entities.Product;
import com.example.swd392_gr03_eco.repositories.ProductRepository;
import com.example.swd392_gr03_eco.service.interfaces.IEmbeddingService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InitializationService {

    private final ProductRepository productRepository;
    private final IEmbeddingService embeddingService;

    @PostConstruct
    public void initializeProductEmbeddings() {
        System.out.println("Starting product embedding initialization...");
        List<Product> products = productRepository.findAll();
        for (Product product : products) {
            if (product.getVectorEmbedding() == null) {
                String text = product.getName() + ". " + product.getDescription();
                float[] embedding = embeddingService.getEmbedding(text);
                // product.setVectorEmbedding(embedding); // This needs a custom type handler
                // For now, we'll skip saving to avoid complexity with JPA and vector types.
                // In a real app, a custom UserType or converter would be needed for H2.
            }
        }
        System.out.println("Product embedding initialization finished.");
    }
}
