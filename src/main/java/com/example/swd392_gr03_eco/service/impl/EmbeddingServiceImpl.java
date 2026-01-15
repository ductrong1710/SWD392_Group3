package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.service.interfaces.IEmbeddingService;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import dev.langchain4j.model.embedding.onnx.allminilml6v2.AllMiniLmL6V2EmbeddingModel; // Import mới
import org.springframework.stereotype.Service;

@Service
public class EmbeddingServiceImpl implements IEmbeddingService {

    // Không dùng HuggingFaceEmbeddingModel nữa
    private final EmbeddingModel embeddingModel;

    public EmbeddingServiceImpl() {
        // Khởi tạo model chạy offline (trong máy)
        // Không cần Token, không cần URL
        this.embeddingModel = new AllMiniLmL6V2EmbeddingModel();
    }

    @Override
    public float[] getEmbedding(String text) {
        try {
            // Hàm này chạy cực nhanh và không bao giờ timeout
            Embedding embedding = embeddingModel.embed(text).content();
            return embedding.vector();
        } catch (Exception e) {
            System.err.println("Error calculating embedding: " + e.getMessage());
            return new float[384]; // Model này luôn trả về kích thước 384
        }
    }
}