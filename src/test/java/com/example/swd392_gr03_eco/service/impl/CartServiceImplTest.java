package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.CartItemRequest;
import com.example.swd392_gr03_eco.model.dto.response.CartDto;
import com.example.swd392_gr03_eco.model.entities.Product;
import com.example.swd392_gr03_eco.model.entities.ProductImage;
import com.example.swd392_gr03_eco.model.entities.ProductVariant;
import com.example.swd392_gr03_eco.repositories.ProductVariantRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CartServiceImplTest {

    @Mock
    private ProductVariantRepository productVariantRepository;

    @InjectMocks
    private CartServiceImpl cartService;

    private ProductVariant variant;

    @BeforeEach
    void setUp() {
        Product product = Product.builder()
                .id(1)
                .name("Test T-Shirt")
                .basePrice(new BigDecimal("250000"))
                .productImages(List.of(ProductImage.builder().imageUrl("image.jpg").build()))
                .build();

        variant = ProductVariant.builder()
                .id(101)
                .product(product)
                .color("Red")
                .size("M")
                .priceOverride(null)
                .stockQuantity(10)
                .build();
    }

    @Test
    void testAddItem_NewItem_ShouldSucceed() {
        // Arrange
        CartItemRequest request = new CartItemRequest();
        request.setProductVariantId(101);
        request.setQuantity(2);

        when(productVariantRepository.findById(101)).thenReturn(Optional.of(variant));

        // Act
        CartDto cartDto = cartService.addItem(null, request);

        // Assert
        assertNotNull(cartDto);
        assertEquals(1, cartDto.getItems().size());
        assertEquals(2, cartDto.getItems().get(0).getQuantity());
        assertEquals(new BigDecimal("500000"), cartDto.getTotalPrice());
        verify(productVariantRepository, times(1)).findById(101);
    }

    @Test
    void testUpdateItem_ChangeQuantity_ShouldSucceed() {
        // Arrange
        CartItemRequest addRequest = new CartItemRequest();
        addRequest.setProductVariantId(101);
        addRequest.setQuantity(1);
        when(productVariantRepository.findById(101)).thenReturn(Optional.of(variant));
        CartDto initialCart = cartService.addItem(null, addRequest);

        CartItemRequest updateRequest = new CartItemRequest();
        updateRequest.setProductVariantId(101);
        updateRequest.setQuantity(5);

        // Act
        CartDto updatedCart = cartService.updateItem(initialCart, updateRequest);

        // Assert
        assertNotNull(updatedCart);
        assertEquals(1, updatedCart.getItems().size());
        assertEquals(5, updatedCart.getItems().get(0).getQuantity());
        assertEquals(new BigDecimal("1250000"), updatedCart.getTotalPrice());
    }

    @Test
    void testRemoveItem_ShouldSucceed() {
        // Arrange
        CartItemRequest addRequest = new CartItemRequest();
        addRequest.setProductVariantId(101);
        addRequest.setQuantity(2);
        when(productVariantRepository.findById(101)).thenReturn(Optional.of(variant));
        CartDto initialCart = cartService.addItem(null, addRequest);

        // Act
        cartService.removeItem(initialCart, 101);
        CartDto updatedCart = cartService.getCart(initialCart);


        // Assert
        assertNotNull(updatedCart);
        assertTrue(updatedCart.getItems().isEmpty());
        assertEquals(BigDecimal.ZERO, updatedCart.getTotalPrice());
    }
}
