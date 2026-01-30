package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.ProductCreateRequest;
import com.example.swd392_gr03_eco.model.entities.Category;
import com.example.swd392_gr03_eco.model.entities.Product;
import com.example.swd392_gr03_eco.model.entities.ProductVariant;
import com.example.swd392_gr03_eco.repositories.CategoryRepository;
import com.example.swd392_gr03_eco.repositories.ProductRepository;
import com.example.swd392_gr03_eco.service.interfaces.IAiService;
import com.example.swd392_gr03_eco.service.interfaces.IProductService;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IAiService aiService;
    private final EmbeddingModel embeddingModel;

    @Override
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    @Override
    public Page<Product> searchProducts(String keyword, Integer categoryId, String brand, Double minPrice, Double maxPrice, Pageable pageable) {
        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.isTrue(root.get("isActive")));
            if (keyword != null && !keyword.isEmpty()) predicates.add(cb.like(root.get("name"), "%" + keyword + "%"));
            if (categoryId != null) predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            if (brand != null && !brand.isEmpty()) predicates.add(cb.equal(root.get("brandName"), brand));
            if (minPrice != null) predicates.add(cb.greaterThanOrEqualTo(root.get("basePrice"), BigDecimal.valueOf(minPrice)));
            if (maxPrice != null) predicates.add(cb.lessThanOrEqualTo(root.get("basePrice"), BigDecimal.valueOf(maxPrice)));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return productRepository.findAll(spec, pageable);
    }

    @Override
    public Product getProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found ID: " + id));
    }

    @Override
    @Transactional
    public Product createProduct(ProductCreateRequest request) {
        String categoryName = aiService.classifyProduct(request.getName(), request.getDescription());
        Category category = categoryRepository.findByName(categoryName)
                .orElseGet(() -> categoryRepository.findByName("Uncategorized").orElse(null));

        String embeddingText = request.getName() + " " + request.getDescription();
        Embedding embedding = embeddingModel.embed(embeddingText).content();
        float[] vector = embedding.vector();
        String vectorString = IntStream.range(0, vector.length)
                                     .mapToObj(i -> String.valueOf(vector[i]))
                                     .collect(Collectors.joining(",", "[", "]"));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(category)
                .brandName(request.getBrandName())
                .basePrice(request.getBasePrice())
                .isActive(true)
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .vectorEmbedding(vectorString)
                .build();

        List<ProductVariant> variants = new ArrayList<>();
        if (request.getVariants() != null) {
            for (ProductCreateRequest.VariantDTO dto : request.getVariants()) {
                variants.add(ProductVariant.builder()
                        .product(product).sku(dto.getSku()).color(dto.getColor())
                        .size(dto.getSize()).priceOverride(dto.getPriceOverride())
                        .stockQuantity(dto.getStockQuantity()).build());
            }
        }
        product.setProductVariants(variants);

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Integer id, ProductCreateRequest request) {
        Product product = getProductById(id);
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrandName(request.getBrandName());
        product.setBasePrice(request.getBasePrice());

        String embeddingText = request.getName() + " " + request.getDescription();
        Embedding embedding = embeddingModel.embed(embeddingText).content();
        float[] vector = embedding.vector();
        String vectorString = IntStream.range(0, vector.length)
                                     .mapToObj(i -> String.valueOf(vector[i]))
                                     .collect(Collectors.joining(",", "[", "]"));
        product.setVectorEmbedding(vectorString);

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Integer id) {
        Product product = getProductById(id);
        product.setIsActive(false);
        productRepository.save(product);
        log.info("Deactivated product with ID {}", id);
    }
}
