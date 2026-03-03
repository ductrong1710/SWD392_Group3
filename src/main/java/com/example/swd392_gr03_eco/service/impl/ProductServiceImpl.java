package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.ImageRequestDto;
import com.example.swd392_gr03_eco.model.dto.request.ProductCreateRequest;
import com.example.swd392_gr03_eco.model.dto.request.ProductUpdateRequest;
import com.example.swd392_gr03_eco.model.dto.request.ProductUpdateStatusRequest;
import com.example.swd392_gr03_eco.model.dto.response.*;
import com.example.swd392_gr03_eco.model.entities.*;
import com.example.swd392_gr03_eco.repositories.CategoryRepository;
import com.example.swd392_gr03_eco.repositories.ProductImageRepository;
import com.example.swd392_gr03_eco.repositories.ProductRepository;
import com.example.swd392_gr03_eco.repositories.ProductVariantRepository;
import com.example.swd392_gr03_eco.service.interfaces.IAiService;
import com.example.swd392_gr03_eco.service.interfaces.IProductService;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
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
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final IAiService aiService;
    private final EmbeddingModel embeddingModel;

    // --- Read Operations ---
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
    public Page<ProductSummaryDto> getProductsByGender(String gender, Pageable pageable) {
        String categoryName = "men".equalsIgnoreCase(gender) ? "Men's Fashion" : "women".equalsIgnoreCase(gender) ? "Women's Fashion" : null;

        if (categoryName == null) {
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }

        return categoryRepository.findByName(categoryName)
                .map(parentCategory -> {
                    Page<Product> productPage = productRepository.findByParentCategoryId(parentCategory.getId(), pageable);
                    return productPage.map(this::convertToProductSummaryDto);
                })
                .orElse(new PageImpl<>(Collections.emptyList(), pageable, 0));
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
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return convertToProductDetailDto(product);
    }

    @Override
    @Transactional
    public Product createProduct(ProductCreateRequest request) {
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
        
        // Save product first to get an ID
        Product savedProduct = productRepository.saveAndFlush(product);

        // --- NEW: Handle Images ---
        if (request.getImages() != null && !request.getImages().isEmpty()) {
            List<ProductImage> images = new ArrayList<>();
            for (ImageRequestDto imgDto : request.getImages()) {
                images.add(ProductImage.builder()
                        .product(savedProduct)
                        .imageUrl(imgDto.getImageUrl())
                        .isThumbnail(imgDto.getIsThumbnail())
                        .color(imgDto.getColor())
                        .build());
            }
            productImageRepository.saveAll(images);
            savedProduct.setProductImages(images);
        }

        // --- Handle Variants ---
        List<ProductVariant> variants = new ArrayList<>();
        if (request.getVariants() != null && !request.getVariants().isEmpty()) {
            for (ProductCreateRequest.VariantDTO dto : request.getVariants()) {
                variants.add(ProductVariant.builder()
                        .product(savedProduct)
                        .sku(dto.getSku())
                        .color(dto.getColor())
                        .size(dto.getSize())
                        .material(dto.getMaterial())
                        .priceOverride(dto.getPriceOverride())
                        .stockQuantity(dto.getStockQuantity())
                        .build());
            }
            savedProduct.setProductVariants(variants);
        }
        
        updateVectorForProduct(savedProduct);

        return productRepository.save(savedProduct);
    }

    @Override
    @Transactional
    public ProductDetailDto updateProduct(Integer id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setBrandName(request.getBrandName());
        product.setBasePrice(request.getBasePrice());
        product.setIsActive(request.getIsActive());

        if (request.getCategoryId() != null && !request.getCategoryId().equals(product.getCategory().getId())) {
            Category newCategory = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + request.getCategoryId()));
            product.setCategory(newCategory);
        }

        updateVectorForProduct(product);
        Product updatedProduct = productRepository.save(product);
        return convertToProductDetailDto(updatedProduct);
    }

    @Override
    @Transactional
    public ProductDetailDto updateProductStatus(Integer id, ProductUpdateStatusRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        product.setIsActive(request.isActive());
        Product updatedProduct = productRepository.save(product);
        return convertToProductDetailDto(updatedProduct);
    }

    @Override
    @Transactional
    public void deleteProduct(Integer id) {
        Product product = productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found"));
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
        if (product.getCategory() != null) {
            categoryDto.setId(product.getCategory().getId());
            categoryDto.setName(product.getCategory().getName());
        }
        dto.setCategory(categoryDto);


        dto.setProductImages(product.getProductImages().stream().map(image -> {
            ProductImageDto imageDto = new ProductImageDto();
            imageDto.setId(image.getId());
            imageDto.setImageUrl(image.getImageUrl());
            imageDto.setIsThumbnail(image.getIsThumbnail());
            imageDto.setColor(image.getColor());
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
        StringBuilder embeddingBuilder = new StringBuilder();
        embeddingBuilder.append("Name: ").append(product.getName()).append(". ");
        embeddingBuilder.append("Description: ").append(product.getDescription()).append(". ");
        embeddingBuilder.append("Brand: ").append(product.getBrandName()).append(". ");

        if (product.getProductVariants() != null && !product.getProductVariants().isEmpty()) {
            Set<String> colors = product.getProductVariants().stream().map(ProductVariant::getColor).collect(Collectors.toSet());
            Set<String> materials = product.getProductVariants().stream().map(ProductVariant::getMaterial).collect(Collectors.toSet());

            if (!colors.isEmpty()) embeddingBuilder.append("Available colors: ").append(String.join(", ", colors)).append(". ");
            if (!materials.isEmpty()) embeddingBuilder.append("Materials: ").append(String.join(", ", materials)).append(". ");
        }

        Embedding embedding = embeddingModel.embed(embeddingBuilder.toString()).content();
        float[] vector = embedding.vector();
        String vectorString = IntStream.range(0, vector.length)
                                     .mapToObj(i -> String.valueOf(vector[i]))
                                     .collect(Collectors.joining(",", "[", "]"));
        product.setVectorEmbedding(vectorString);
    }
}
