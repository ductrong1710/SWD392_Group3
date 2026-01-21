package com.example.swd392_gr03_eco.controller;

import com.example.swd392_gr03_eco.model.dto.request.CartItemRequest;
import com.example.swd392_gr03_eco.model.dto.request.OrderRequest;
import com.example.swd392_gr03_eco.model.dto.request.RegisterRequest;
import com.example.swd392_gr03_eco.model.dto.response.AuthResponse;
import com.example.swd392_gr03_eco.model.entities.Order;
import com.example.swd392_gr03_eco.model.entities.Product;
import com.example.swd392_gr03_eco.model.entities.ProductVariant;
import com.example.swd392_gr03_eco.model.entities.User;
import com.example.swd392_gr03_eco.repositories.OrderRepository;
import com.example.swd392_gr03_eco.repositories.ProductRepository;
import com.example.swd392_gr03_eco.repositories.ProductVariantRepository;
import com.example.swd392_gr03_eco.repositories.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@TestPropertySource(properties = {
    "application.security.jwt.secret-key=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
    "application.security.jwt.expiration=86400000"
})
class OrderControllerIntegrationTest {

    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @Autowired private ProductRepository productRepository;
    @Autowired private ProductVariantRepository productVariantRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private OrderRepository orderRepository;

    private String customerToken;
    private User customer;
    private ProductVariant testVariant;

    @BeforeEach
    void setUp() throws Exception {
        Product testProduct = productRepository.save(Product.builder().name("Test Shoe").basePrice(new BigDecimal("1000")).isActive(true).build());
        testVariant = productVariantRepository.save(ProductVariant.builder().product(testProduct).sku("SHOE-RED-42").stockQuantity(20).build());

        RegisterRequest registerRequest = new RegisterRequest("Order Tester", "order@test.com", "password", "123");
        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerRequest)));

        MvcResult loginResult = mockMvc.perform(post("/api/v1/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"order@test.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk())
                .andReturn();
        AuthResponse authResponse = objectMapper.readValue(loginResult.getResponse().getContentAsString(), AuthResponse.class);
        customerToken = authResponse.getToken();
        customer = userRepository.findByEmail("order@test.com").orElseThrow();
    }

    private MockHttpSession createSessionWithCart() throws Exception {
        MockHttpSession session = new MockHttpSession();
        CartItemRequest cartItem = new CartItemRequest();
        cartItem.setProductVariantId(testVariant.getId());
        cartItem.setQuantity(2);

        MvcResult cartResult = mockMvc.perform(post("/api/v1/cart/items")
                .header("Authorization", "Bearer " + customerToken)
                .session(session)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cartItem)))
                .andExpect(status().isCreated())
                .andReturn();
        
        return (MockHttpSession) cartResult.getRequest().getSession();
    }

    @Test
    @DisplayName("TC1: Create Order - Should return 201 Created when cart is not empty")
    void createOrder_withItemsInCart_shouldSucceed() throws Exception {
        MockHttpSession sessionWithCart = createSessionWithCart();
        OrderRequest orderRequest = new OrderRequest();
        orderRequest.setFullName("Order Tester");
        orderRequest.setAddress("123 Test St");
        orderRequest.setPaymentMethod("COD");

        mockMvc.perform(post("/api/v1/orders")
                .header("Authorization", "Bearer " + customerToken)
                .session(sessionWithCart)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(orderRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.paymentUrl").doesNotExist());
    }

    @Test
    @DisplayName("TC2: Get Orders - Should return list of orders for the current user")
    void getCurrentUserOrders_shouldReturnOrders() throws Exception {
        orderRepository.save(Order.builder().user(customer).status("PENDING").build());

        mockMvc.perform(get("/api/v1/orders")
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].orderId").exists());
    }

    @Test
    @DisplayName("TC3: Get Order Detail - Should return order details if user is owner")
    void getOrderDetail_shouldReturn200() throws Exception {
        Order order = orderRepository.save(Order.builder().user(customer).status("PENDING").orderItems(List.of()).build());

        mockMvc.perform(get("/api/v1/orders/" + order.getId())
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(order.getId()));
    }

    @Test
    @DisplayName("TC4: Cancel Order - Should return 204 No Content if order is pending")
    void cancelOrder_shouldReturn204() throws Exception {
        Order order = orderRepository.save(Order.builder().user(customer).status("PENDING").orderItems(List.of()).build());

        mockMvc.perform(delete("/api/v1/orders/" + order.getId())
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isNoContent());
    }
}
