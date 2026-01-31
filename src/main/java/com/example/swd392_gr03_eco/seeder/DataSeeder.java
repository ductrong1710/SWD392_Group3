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
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

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

        // 1. SEED ROLES & USERS
        Role adminRole = getOrSaveRole("ADMIN");
        Role staffRole = getOrSaveRole("STAFF");
        Role customerRole = getOrSaveRole("CUSTOMER");
        User customer1 = createUserIfNotExist("Nguyen Van A", "customer@example.com", "0901000003", "123456", customerRole);
        User customer2 = createUserIfNotExist("Tran Thi B", "customer2@example.com", "0901000004", "123456", customerRole);

        // 2. SEED CATEGORIES
        Category catMen = getOrSaveCategory("Thời trang nam", null);
        Category catWomen = getOrSaveCategory("Thời trang nữ", null);
        Category catAccessory = getOrSaveCategory("Phụ kiện", null);
        Category catMenTop = getOrSaveCategory("Áo nam", catMen);
        Category catMenBottom = getOrSaveCategory("Quần nam", catMen);
        Category catWomenDress = getOrSaveCategory("Váy đầm", catWomen);

        // 3. SEED PRODUCTS & VARIANTS
        // Product 1
        Product p1 = createProductWithoutVector("Áo Thun Cotton", "Áo thun 100% cotton, thấm hút mồ hôi.", catMenTop, "Coolmate", "299000");
        createProductImage(p1, "https://mcdn.coolmate.me/image/August2023/mceclip0_51.jpg", true);
        List<ProductVariant> p1Variants = new ArrayList<>();
        p1Variants.add(createProductVariant(p1, "CM-AT-TR-M", "Trắng", "M", "Cotton", null, 100));
        p1Variants.add(createProductVariant(p1, "CM-AT-DE-L", "Đen", "L", "Cotton", null, 50));
        updateProductWithVector(p1, p1Variants); // Update vector after variants are created

        // Product 2
        Product p2 = createProductWithoutVector("Áo Polo Basic", "Áo Polo dáng regular fit, lịch sự.", catMenTop, "Routine", "350000");
        createProductImage(p2, "https://routine.vn/media/catalog/product/cache/5de180fd8911a43452e74825e3431393/a/o/ao-polo-nam-10s24pol007-black-2_1.jpg", true);
        List<ProductVariant> p2Variants = new ArrayList<>();
        p2Variants.add(createProductVariant(p2, "RT-PL-XN-XL", "Xanh Navy", "XL", "Vải Pique", null, 80));
        updateProductWithVector(p2, p2Variants);

        // ... and so on for other products
        Product p3 = createProductWithoutVector("Quần Jeans Slim Fit", "Quần Jeans co giãn 4 chiều.", catMenBottom, "Levi's", "1500000");
        createProductImage(p3, "https://lscdn.lexholding.com/images/levis-vn/2023/11/27/1701055536-511-slim-04511-5753-1.jpeg", true);
        List<ProductVariant> p3Variants = new ArrayList<>();
        p3Variants.add(createProductVariant(p3, "LV-JN-IN-32", "Xanh Indigo", "32", "Jean-Elastane", null, 120));
        updateProductWithVector(p3, p3Variants);

        Product p4 = createProductWithoutVector("Đầm Maxi Đi Biển", "Đầm maxi voan hoa nhí, dáng dài.", catWomenDress, "Zara", "1299000");
        createProductImage(p4, "https://static.zara.net/photos///2024/V/0/1/p/8372/063/330/2/w/600/8372063330_1_1_1.jpg?ts=1707307220129", true);
        List<ProductVariant> p4Variants = new ArrayList<>();
        p4Variants.add(createProductVariant(p4, "ZR-DM-HO-S", "Họa tiết", "S", "Voan", null, 60));
        updateProductWithVector(p4, p4Variants);

        Product p5 = createProductWithoutVector("Balo Laptop Chống Sốc", "Balo đựng laptop 15.6 inch.", catAccessory, "Samsonite", "3500000");
        createProductImage(p5, "https://samsonite-vietnam.com/Data/Sites/1/Product/11102/samsonite-balo-sefton-dlx-backpack-dv1-09005-black-1.jpg", true);
        List<ProductVariant> p5Variants = new ArrayList<>();
        p5Variants.add(createProductVariant(p5, "SS-BL-DE-15", "Đen", "15.6 inch", "Polyester", null, 30));
        updateProductWithVector(p5, p5Variants);

        // 4. SEED ORDERS
        Order order1 = createOrder(customer1, "Giao hàng nhanh", "PENDING");
        createOrderItem(order1, p1Variants.get(0), 2, p1Variants.get(0).getProduct().getBasePrice());
        createOrderItem(order1, p3Variants.get(0), 1, p3Variants.get(0).getProduct().getBasePrice());
        updateOrderTotals(order1);
        createPayment(order1, customer1, "COD", "PENDING", null);

        Order order2 = createOrder(customer2, "Giao tận nơi", "COMPLETED");
        OrderItem oi2_1 = createOrderItem(order2, p4Variants.get(0), 1, p4Variants.get(0).getProduct().getBasePrice());
        updateOrderTotals(order2);
        createPayment(order2, customer2, "VNPAY", "SUCCESS", "VNP123456");
        createReview(customer2, oi2_1, 5, "Váy rất đẹp, chất vải mát!");

        log.info(">>> DATA SEEDING FINISHED SUCCESSFULLY <<<");
    }

    private Product createProductWithoutVector(String name, String desc, Category category, String brand, String price) {
        Product product = Product.builder()
                .name(name).description(desc).category(category)
                .brandName(brand).basePrice(new BigDecimal(price))
                .isActive(true).createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
        return productRepository.save(product);
    }
    
    private void updateProductWithVector(Product product, List<ProductVariant> variants) {
        StringBuilder embeddingBuilder = new StringBuilder();
        embeddingBuilder.append(product.getName()).append(". ");
        embeddingBuilder.append(product.getDescription()).append(". ");
        embeddingBuilder.append("Hãng: ").append(product.getBrandName()).append(". ");

        Set<String> colors = variants.stream().map(ProductVariant::getColor).collect(Collectors.toSet());
        Set<String> materials = variants.stream().map(ProductVariant::getMaterial).collect(Collectors.toSet());

        if (!colors.isEmpty()) {
            embeddingBuilder.append("Các màu hiện có: ").append(String.join(", ", colors)).append(". ");
        }
        if (!materials.isEmpty()) {
            embeddingBuilder.append("Chất liệu: ").append(String.join(", ", materials)).append(". ");
        }
        
        Embedding embedding = embeddingModel.embed(embeddingBuilder.toString()).content();
        float[] vector = embedding.vector();
        String vectorString = IntStream.range(0, vector.length)
                                     .mapToObj(i -> String.valueOf(vector[i]))
                                     .collect(Collectors.joining(",", "[", "]"));
        product.setVectorEmbedding(vectorString);
        productRepository.save(product);
    }

    // Other helper methods remain the same...
    private Role getOrSaveRole(String roleName) { return roleRepository.findByRoleName(roleName).orElseGet(() -> roleRepository.save(Role.builder().roleName(roleName).build())); }
    private User createUserIfNotExist(String name, String email, String phone, String password, Role role) { return userRepository.findByEmail(email).orElseGet(() -> { User user = User.builder().fullName(name).email(email).phone(phone).passwordHash(passwordEncoder.encode(password)).isActive(true).createdAt(new Timestamp(System.currentTimeMillis())).role(role).build(); log.info("Created user: " + email); return userRepository.save(user); }); }
    private Category getOrSaveCategory(String name, Category parent) { return categoryRepository.findByName(name).orElseGet(() -> categoryRepository.save(Category.builder().name(name).parent(parent).build())); }
    private ProductImage createProductImage(Product product, String imageUrl, boolean isThumbnail) { return productImageRepository.save(ProductImage.builder().product(product).imageUrl(imageUrl).isThumbnail(isThumbnail).build()); }
    private ProductVariant createProductVariant(Product product, String sku, String color, String size, String material, String priceOverride, int stock) { return productVariantRepository.save(ProductVariant.builder().product(product).sku(sku).color(color).size(size).material(material).priceOverride(priceOverride != null ? new BigDecimal(priceOverride) : null).stockQuantity(stock).build()); }
    private Order createOrder(User user, String notes, String status) { Map<String, String> address = Map.of("fullName", user.getFullName(), "phone", user.getPhone(), "address", "123 Duong ABC, Phuong XYZ, Quan 1", "city", "Ho Chi Minh", "notes", notes); String addressJson = ""; try { addressJson = objectMapper.writeValueAsString(address); } catch (JsonProcessingException e) { log.error("Error serializing address", e); } Order order = Order.builder().user(user).status(status).shippingAddressJson(addressJson).shippingProvider("GHTK").createdAt(new Timestamp(System.currentTimeMillis())).totalAmount(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO).finalAmount(BigDecimal.ZERO).build(); return orderRepository.save(order); }
    private OrderItem createOrderItem(Order order, ProductVariant variant, int quantity, BigDecimal priceAtPurchase) { return orderItemRepository.save(OrderItem.builder().order(order).productVariant(variant).quantity(quantity).priceAtPurchase(priceAtPurchase).build()); }
    private void updateOrderTotals(Order order) { List<OrderItem> items = orderItemRepository.findByOrder(order); BigDecimal total = items.stream().map(item -> item.getPriceAtPurchase().multiply(new BigDecimal(item.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add); order.setTotalAmount(total); order.setFinalAmount(total.subtract(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO)); orderRepository.save(order); }
    private Payment createPayment(Order order, User user, String method, String status, String transactionCode) { return paymentRepository.save(Payment.builder().order(order).user(user).method(method).status(status).transactionCode(transactionCode).paidAt(status.equals("SUCCESS") ? new Timestamp(System.currentTimeMillis()) : null).build()); }
    private Review createReview(User user, OrderItem orderItem, int rating, String comment) { return reviewRepository.save(Review.builder().user(user).orderItem(orderItem).rating(rating).comment(comment).createdAt(new Timestamp(System.currentTimeMillis())).build()); }
}
