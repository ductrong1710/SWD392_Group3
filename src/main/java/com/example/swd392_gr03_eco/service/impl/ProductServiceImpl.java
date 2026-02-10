package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.ProductCreateRequest;
import com.example.swd392_gr03_eco.model.dto.response.*;
import com.example.swd392_gr03_eco.model.entities.*;
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
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductServiceImpl implements IProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final IAiService aiService;
    private final EmbeddingModel embeddingModel;

    @Override
    public Page<ProductSummaryDto> getAllProducts(Pageable pageable) {
        Page<Product> productPage = productRepository.findAll(pageable);
        return productPage.map(this::convertToProductSummaryDto);
    }

    @Override
    public Page<ProductSummaryDto> searchProducts(String keyword, Integer categoryId, String brand, Double minPrice, Double maxPrice, Pageable pageable) {
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
        Page<Product> productPage = productRepository.findAll(spec, pageable);
        return productPage.map(this::convertToProductSummaryDto);
    }

    @Override
    public List<ProductDetailDto> getAllProductsAdmin() {
        return productRepository.findAll().stream()
                .map(this::convertToProductDetailDto)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDetailDto getProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found ID: " + id));
        return convertToProductDetailDto(product);
    }

    @Override
    @Transactional
    public Product createProduct(ProductCreateRequest request) {
        // This method remains for internal logic, returning the entity
        String categoryName = aiService.classifyProduct(request.getName(), request.getDescription());
        Category category = categoryRepository.findByName(categoryName)
                .orElseGet(() -> categoryRepository.findByName("Uncategorized").orElse(null));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(category)
                .brandName(request.getBrandName())
                .basePrice(request.getBasePrice())
                .isActive(true)
                .createdAt(Instant.now())
                .build();

        List<ProductVariant> variants = new ArrayList<>();
        if (request.getVariants() != null) {
            for (ProductCreateRequest.VariantDTO dto : request.getVariants()) {
                variants.add(ProductVariant.builder()
                        .product(product).sku(dto.getSku()).color(dto.getColor())
                        .size(dto.getSize()).material(dto.getMaterial())
                        .priceOverride(dto.getPriceOverride())
                        .stockQuantity(dto.getStockQuantity()).build());
            }
        }
        product.setProductVariants(variants);
        
        updateVectorForProduct(product);

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product updateProduct(Integer id, ProductCreateRequest request) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrandName(request.getBrandName());
        product.setBasePrice(request.getBasePrice());
        
        updateVectorForProduct(product);

        return productRepository.save(product);
    }

    @Override
    @Transactional
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        product.setIsActive(false);
        productRepository.save(product);
        log.info("Deactivated product with ID {}", id);
    }

    // --- Mappers ---

    private ProductDetailDto convertToProductDetailDto(Product product) {
        ProductDetailDto dto = new ProductDetailDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setBrandName(product.getBrandName());
        dto.setBasePrice(product.getBasePrice());
        dto.setIsActive(product.getIsActive());
        dto.setCreatedAt(product.getCreatedAt());

        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(product.getCategory().getId());
        categoryDto.setName(product.getCategory().getName());
        dto.setCategory(categoryDto);

        dto.setProductImages(product.getProductImages().stream().map(image -> {
            ProductImageDto imageDto = new ProductImageDto();
            imageDto.setId(image.getId());
            imageDto.setImageUrl(image.getImageUrl());
            imageDto.setIsThumbnail(image.getIsThumbnail());
            return imageDto;
        }).collect(Collectors.toList()));

        dto.setProductVariants(product.getProductVariants().stream().map(variant -> {
            ProductVariantDto variantDto = new ProductVariantDto();
            variantDto.setId(variant.getId());
            variantDto.setSku(variant.getSku());
            variantDto.setColor(variant.getColor());
            variantDto.setSize(variant.getSize());
            variantDto.setMaterial(variant.getMaterial());
            variantDto.setPriceOverride(variant.getPriceOverride());
            variantDto.setStockQuantity(variant.getStockQuantity());
            return variantDto;
        }).collect(Collectors.toList()));

        return dto;
    }

    private ProductSummaryDto convertToProductSummaryDto(Product product) {
        String thumbnailUrl = product.getProductImages().stream()
                .filter(img -> img.getIsThumbnail() != null && img.getIsThumbnail())
                .map(ProductImage::getImageUrl)
                .findFirst()
                .orElse(product.getProductImages().isEmpty() ? null : product.getProductImages().get(0).getImageUrl());

        return ProductSummaryDto.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getBasePrice())
                .brandName(product.getBrandName())
                .thumbnailUrl(thumbnailUrl)
                .build();
    }

    private void updateVectorForProduct(Product product) {
        // This logic remains the same
        StringBuilder embeddingBuilder = new StringBuilder();
        embeddingBuilder.append(product.getName()).append(". ");
        embeddingBuilder.append(product.getDescription()).append(". ");
        embeddingBuilder.append("Hãng: ").append(product.getBrandName()).append(". ");

        if (product.getProductVariants() != null && !product.getProductVariants().isEmpty()) {
            Set<String> colors = product.getProductVariants().stream().map(ProductVariant::getColor).collect(Collectors.toSet());
            Set<String> materials = product.getProductVariants().stream().map(ProductVariant::getMaterial).collect(Collectors.toSet());

            if (!colors.isEmpty()) embeddingBuilder.append("Các màu hiện có: ").append(String.join(", ", colors)).append(". ");
            if (!materials.isEmpty()) embeddingBuilder.append("Chất liệu: ").append(String.join(", ", materials)).append(". ");
        }

        Embedding embedding = embeddingModel.embed(embeddingBuilder.toString()).content();
        float[] vector = embedding.vector();
        String vectorString = IntStream.range(0, vector.length)
                                     .mapToObj(i -> String.valueOf(vector[i]))
                                     .collect(Collectors.joining(",", "[", "]"));
        product.setVectorEmbedding(vectorString);
    }
}
