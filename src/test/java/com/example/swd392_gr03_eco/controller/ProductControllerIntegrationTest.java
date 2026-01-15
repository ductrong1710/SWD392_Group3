package com.example.swd392_gr03_eco.controller;

import com.example.swd392_gr03_eco.model.dto.request.ProductCreateRequest;
import com.example.swd392_gr03_eco.service.interfaces.IAiService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional // Rollback transaction after each test
class ProductControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private IAiService aiService;

    @Test
    void testCreateProduct_ShouldReturnCreatedProduct() throws Exception {
        // Arrange
        // 1. Mock the AI service to return a predictable category
        when(aiService.classifyProduct(anyString(), anyString())).thenReturn("Áo Thun");

        // 2. Prepare the request payload
        ProductCreateRequest.VariantDTO variantDTO = new ProductCreateRequest.VariantDTO();
        variantDTO.setSku("TEST-SKU-01");
        variantDTO.setColor("Blue");
        variantDTO.setSize("XL");
        variantDTO.setStockQuantity(100);

        ProductCreateRequest request = new ProductCreateRequest();
        request.setName("Test Integration T-Shirt");
        request.setDescription("A high-quality t-shirt for testing.");
        request.setBrandName("TesterBrand");
        request.setBasePrice(new BigDecimal("299000"));
        request.setVariants(Collections.singletonList(variantDTO));

        // Act & Assert
        mockMvc.perform(post("/api/v1/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                // Check top-level product fields
                .andExpect(jsonPath("$.name").value("Test Integration T-Shirt"))
                .andExpect(jsonPath("$.brandName").value("TesterBrand"))
                // Check that the category was set correctly by the (mocked) AI
                .andExpect(jsonPath("$.category.name").value("Áo Thun"))
                // Check nested variant fields
                .andExpect(jsonPath("$.productVariants[0].sku").value("TEST-SKU-01"))
                .andExpect(jsonPath("$.productVariants[0].stockQuantity").value(100));
    }
}
