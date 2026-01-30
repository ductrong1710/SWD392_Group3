package com.example.swd392_gr03_eco.seeder;

import com.example.swd392_gr03_eco.model.entities.*;
import com.example.swd392_gr03_eco.repositories.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream; // Import IntStream

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductVariantRepository productVariantRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;

    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    private final EmbeddingModel embeddingModel;

    @Override
    public void run(String... args) throws Exception {
        seedAllData();
    }

    @Transactional
    public void seedAllData() {
        log.info(">>> STARTING DATA SEEDING <<<");

        if (userRepository.count() > 0) {
            log.info(">>> Data already seeded. Skipping. <<<");
            return;
        }

        Role adminRole = getOrSaveRole("ADMIN");
        Role staffRole = getOrSaveRole("STAFF");
        Role customerRole = getOrSaveRole("CUSTOMER");

        User admin = createUserIfNotExist("Admin User", "admin@example.com", "0901000001", "123456", adminRole);
        User staff = createUserIfNotExist("Staff User", "staff@example.com", "0901000002", "123456", staffRole);
        User customer1 = createUserIfNotExist("Nguyen Van A", "customer@example.com", "0901000003", "123456", customerRole);
        User customer2 = createUserIfNotExist("Tran Thi B", "customer2@example.com", "0901000004", "123456", customerRole);

        Category catMen = getOrSaveCategory("Thời trang nam", null);
        Category catWomen = getOrSaveCategory("Thời trang nữ", null);
        Category catAccessory = getOrSaveCategory("Phụ kiện", null);

        Category catMenTop = getOrSaveCategory("Áo nam", catMen);
        Category catMenBottom = getOrSaveCategory("Quần nam", catMen);
        Category catWomenDress = getOrSaveCategory("Váy đầm", catWomen);

        Product p1 = createProduct("Áo Thun Cotton", "Áo thun 100% cotton, thấm hút mồ hôi.", catMenTop, "Coolmate", "299000");
        createProductImage(p1, "https://mcdn.coolmate.me/image/August2023/mceclip0_51.jpg", true);
        ProductVariant p1v1 = createProductVariant(p1, "CM-AT-TR-M", "Trắng", "M", "Cotton", null, 100);
        ProductVariant p1v2 = createProductVariant(p1, "CM-AT-DE-L", "Đen", "L", "Cotton", null, 50);

        Product p2 = createProduct("Áo Polo Basic", "Áo Polo dáng regular fit, lịch sự.", catMenTop, "Routine", "350000");
        createProductImage(p2, "https://routine.vn/media/catalog/product/cache/5de180fd8911a43452e74825e3431393/a/o/ao-polo-nam-10s24pol007-black-2_1.jpg", true);
        ProductVariant p2v1 = createProductVariant(p2, "RT-PL-XN-XL", "Xanh Navy", "XL", "Vải Pique", null, 80);

        Product p3 = createProduct("Quần Jeans Slim Fit", "Quần Jeans co giãn 4 chiều.", catMenBottom, "Levi's", "1500000");
        createProductImage(p3, "https://lscdn.lexholding.com/images/levis-vn/2023/11/27/1701055536-511-slim-04511-5753-1.jpeg", true);
        ProductVariant p3v1 = createProductVariant(p3, "LV-JN-IN-32", "Xanh Indigo", "32", "Jean-Elastane", null, 120);

        Product p4 = createProduct("Đầm Maxi Đi Biển", "Đầm maxi voan hoa nhí, dáng dài.", catWomenDress, "Zara", "1299000");
        createProductImage(p4, "https://static.zara.net/photos///2024/V/0/1/p/8372/063/330/2/w/600/8372063330_1_1_1.jpg?ts=1707307220129", true);
        ProductVariant p4v1 = createProductVariant(p4, "ZR-DM-HO-S", "Họa tiết", "S", "Voan", null, 60);

        Product p5 = createProduct("Balo Laptop Chống Sốc", "Balo đựng laptop 15.6 inch.", catAccessory, "Samsonite", "3500000");
        createProductImage(p5, "https://samsonite-vietnam.com/Data/Sites/1/Product/11102/samsonite-balo-sefton-dlx-backpack-dv1-09005-black-1.jpg", true);
        ProductVariant p5v1 = createProductVariant(p5, "SS-BL-DE-15", "Đen", "15.6 inch", "Polyester", null, 30);

        Order order1 = createOrder(customer1, "Giao hàng nhanh", "PENDING");
        createOrderItem(order1, p1v1, 2, p1v1.getProduct().getBasePrice());
        createOrderItem(order1, p3v1, 1, p3v1.getProduct().getBasePrice());
        updateOrderTotals(order1);
        createPayment(order1, customer1, "COD", "PENDING", null);

        Order order2 = createOrder(customer2, "Giao tận nơi", "COMPLETED");
        OrderItem oi2_1 = createOrderItem(order2, p4v1, 1, p4v1.getProduct().getBasePrice());
        updateOrderTotals(order2);
        createPayment(order2, customer2, "VNPAY", "SUCCESS", "VNP123456");
        createReview(customer2, oi2_1, 5, "Váy rất đẹp, chất vải mát!");

        log.info(">>> DATA SEEDING FINISHED SUCCESSFULLY <<<");
    }

    private Role getOrSaveRole(String roleName) {
        return roleRepository.findByRoleName(roleName)
                .orElseGet(() -> roleRepository.save(Role.builder().roleName(roleName).build()));
    }

    private User createUserIfNotExist(String name, String email, String phone, String password, Role role) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User user = User.builder()
                            .fullName(name).email(email).phone(phone)
                            .passwordHash(passwordEncoder.encode(password))
                            .isActive(true).createdAt(new Timestamp(System.currentTimeMillis()))
                            .role(role).build();
                    log.info("Created user: " + email);
                    return userRepository.save(user);
                });
    }

    private Category getOrSaveCategory(String name, Category parent) {
        return categoryRepository.findByName(name)
                .orElseGet(() -> categoryRepository.save(Category.builder().name(name).parent(parent).build()));
    }

    private Product createProduct(String name, String desc, Category category, String brand, String price) {
        String embeddingText = name + ". " + desc + ". Brand: " + brand;
        Embedding embedding = embeddingModel.embed(embeddingText).content();
        
        // FIX: Use IntStream to correctly convert float[] to a String
        float[] vector = embedding.vector();
        String vectorString = IntStream.range(0, vector.length)
                                     .mapToObj(i -> String.valueOf(vector[i]))
                                     .collect(Collectors.joining(",", "[", "]"));

        Product product = Product.builder()
                .name(name).description(desc).category(category)
                .brandName(brand).basePrice(new BigDecimal(price))
                .isActive(true).createdAt(new Timestamp(System.currentTimeMillis()))
                .vectorEmbedding(vectorString)
                .build();
        return productRepository.save(product);
    }

    private ProductImage createProductImage(Product product, String imageUrl, boolean isThumbnail) {
        return productImageRepository.save(ProductImage.builder()
                .product(product).imageUrl(imageUrl).isThumbnail(isThumbnail).build());
    }

    private ProductVariant createProductVariant(Product product, String sku, String color, String size, String material, String priceOverride, int stock) {
        return productVariantRepository.save(ProductVariant.builder()
                .product(product).sku(sku).color(color).size(size).material(material)
                .priceOverride(priceOverride != null ? new BigDecimal(priceOverride) : null)
                .stockQuantity(stock).build());
    }

    private Order createOrder(User user, String notes, String status) {
        Map<String, String> address = Map.of("fullName", user.getFullName(), "phone", user.getPhone(), "address", "123 Duong ABC, Phuong XYZ, Quan 1", "city", "Ho Chi Minh", "notes", notes);
        String addressJson = "";
        try {
            addressJson = objectMapper.writeValueAsString(address);
        } catch (JsonProcessingException e) {
            log.error("Error serializing address", e);
        }

        Order order = Order.builder()
                .user(user).status(status).shippingAddressJson(addressJson)
                .shippingProvider("GHTK").createdAt(new Timestamp(System.currentTimeMillis()))
                .totalAmount(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO).finalAmount(BigDecimal.ZERO)
                .build();
        return orderRepository.save(order);
    }

    private OrderItem createOrderItem(Order order, ProductVariant variant, int quantity, BigDecimal priceAtPurchase) {
        return orderItemRepository.save(OrderItem.builder()
                .order(order).productVariant(variant).quantity(quantity).priceAtPurchase(priceAtPurchase).build());
    }

    private void updateOrderTotals(Order order) {
        List<OrderItem> items = orderItemRepository.findByOrder(order);
        BigDecimal total = items.stream()
                .map(item -> item.getPriceAtPurchase().multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalAmount(total);
        order.setFinalAmount(total.subtract(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO));
        orderRepository.save(order);
    }

    private Payment createPayment(Order order, User user, String method, String status, String transactionCode) {
        return paymentRepository.save(Payment.builder()
                .order(order).user(user).method(method).status(status).transactionCode(transactionCode)
                .paidAt(status.equals("SUCCESS") ? new Timestamp(System.currentTimeMillis()) : null).build());
    }

    private Review createReview(User user, OrderItem orderItem, int rating, String comment) {
        return reviewRepository.save(Review.builder()
                .user(user).orderItem(orderItem).rating(rating).comment(comment)
                .createdAt(new Timestamp(System.currentTimeMillis())).build());
    }
}
