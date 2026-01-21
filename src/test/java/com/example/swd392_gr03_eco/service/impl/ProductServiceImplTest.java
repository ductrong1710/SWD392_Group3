package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.ProductCreateRequest;
import com.example.swd392_gr03_eco.model.entities.Category;
import com.example.swd392_gr03_eco.model.entities.Product;
import com.example.swd392_gr03_eco.repositories.CategoryRepository;
import com.example.swd392_gr03_eco.repositories.ProductRepository;
import com.example.swd392_gr03_eco.service.interfaces.IAiService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceImplTest {

    @Mock private ProductRepository productRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private IAiService aiService;

    @InjectMocks
    private ProductServiceImpl productService;

    @Test
    @DisplayName("TC1: Create Product Success - Should correctly classify and save product")
    void createProduct_shouldSucceed() {
        // Arrange
        ProductCreateRequest request = new ProductCreateRequest();
        request.setName("New T-Shirt");
        request.setDescription("A great new t-shirt");
        request.setBasePrice(new BigDecimal("300000"));

        Category mockCategory = Category.builder().id(1).name("Áo Thun").build();
        Product mockProduct = Product.builder().id(1).name("New T-Shirt").build();

        when(aiService.classifyProduct(any(), any())).thenReturn("Áo Thun");
        when(categoryRepository.findByName("Áo Thun")).thenReturn(Optional.of(mockCategory));
        when(productRepository.save(any(Product.class))).thenReturn(mockProduct);

        // Act
        Product createdProduct = productService.createProduct(request);

        // Assert
        assertNotNull(createdProduct);
        assertEquals("New T-Shirt", createdProduct.getName());
        System.out.println("PASSED - TC1: Create Product Success");
    }

    @Test
    @DisplayName("TC2: Search Products - Should return a page of products based on criteria")
    void searchProducts_shouldReturnPageOfProducts() {
        // Arrange
        Pageable pageable = PageRequest.of(0, 10);
        Product product = new Product();
        Page<Product> productPage = new PageImpl<>(List.of(product));

        when(productRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(productPage);

        // Act
        Page<Product> result = productService.searchProducts("keyword", 1, "brand", 10.0, 100.0, pageable);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        System.out.println("PASSED - TC2: Search Products");
    }
}
