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
import java.time.Instant;
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

        // 1. SEED ROLES
        Role adminRole = getOrSaveRole("ADMIN");
        Role staffRole = getOrSaveRole("STAFF");
        Role customerRole = getOrSaveRole("CUSTOMER");

        // 2. SEED USERS
        createUserIfNotExist("Main Admin", "admin@example.com", "0901000001", "123 Main St, District 1, HCMC", "123456", adminRole);
        createUserIfNotExist("Sales Staff", "staff@example.com", "0901000002", "456 Market St, District 3, HCMC", "123456", staffRole);
        User customer1 = createUserIfNotExist("Nguyen Van A", "customer@example.com", "0901000003", "789 Nguyen Trai St, District 5, HCMC", "123456", customerRole);
        User customer2 = createUserIfNotExist("Tran Thi B", "customer2@example.com", "0901000004", "101 Le Loi St, District 1, HCMC", "123456", customerRole);

        // 3. SEED CATEGORIES
        Category catMen = getOrSaveCategory("Thời trang nam", null);
        Category catWomen = getOrSaveCategory("Thời trang nữ", null);
        Category catMenTshirt = getOrSaveCategory("Áo Thun Nam", catMen);
        Category catMenPolo = getOrSaveCategory("Áo Polo Nam", catMen);
        Category catMenShirt = getOrSaveCategory("Áo Sơ Mi Nam", catMen);
        Category catMenJeans = getOrSaveCategory("Quần Jeans Nam", catMen);
        Category catWomenDress = getOrSaveCategory("Váy Đầm", catWomen);
        Category catWomenSkirt = getOrSaveCategory("Chân Váy", catWomen);

        // 4. SEED PRODUCTS & VARIANTS
        Product p1 = createProductWithoutVector("Áo Thun Trơn Cotton Compact", "Áo thun cơ bản, vải cotton compact cao cấp, mềm mịn, thấm hút mồ hôi tốt và hạn chế xù lông.", catMenTshirt, "Coolmate", "239000");
        createProductImage(p1, "https://product.hstatic.net/1000360022/product/id-000130a_-_copy_c11ee155e74f4149829ce0432d4b9417_1024x1024.jpg", true);
        List<ProductVariant> p1Variants = List.of(
            createProductVariant(p1, "CM-TS-BLK-M", "Đen", "M", "Cotton Compact", null, 150),
            createProductVariant(p1, "CM-TS-WHT-L", "Trắng", "L", "Cotton Compact", null, 180)
        );
        updateProductWithVector(p1, p1Variants);

        Product p2 = createProductWithoutVector("Áo Polo Cafe-Knit", "Áo polo nam sử dụng công nghệ dệt từ bã cafe, giúp khử mùi, nhanh khô và chống tia UV.", catMenPolo, "Routine", "450000");
        createProductImage(p2, "https://product.hstatic.net/1000360022/product/dsc06208_c091f1587bfd46499076a251c251b4da_1024x1024.jpg", true);
        List<ProductVariant> p2Variants = List.of(
            createProductVariant(p2, "RT-PL-GRY-L", "Xám", "L", "Vải Cafe-Knit", null, 70)
        );
        updateProductWithVector(p2, p2Variants);

        // 5. SEED ORDERS
        Order order1 = createOrder(customer1, "Giao hàng nhanh", "PENDING");
        createOrderItem(order1, p1Variants.get(0), 1, p1.getBasePrice());
        updateOrderTotals(order1);
        createPayment(order1, customer1, "COD", "PENDING", null);

        log.info(">>> DATA SEEDING FINISHED SUCCESSFULLY <<<");
    }
    
    private User createUserIfNotExist(String name, String email, String phone, String address, String password, Role role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = User.builder()
                    .fullName(name).email(email).phone(phone).address(address)
                    .passwordHash(passwordEncoder.encode(password))
                    .isActive(true).createdAt(Instant.now()).role(role).build();
            log.info("Created user: " + email);
            return userRepository.save(user);
        });
    }

    // Other helper methods...
    private Product createProductWithoutVector(String name, String desc, Category category, String brand, String price) { Product product = Product.builder().name(name).description(desc).category(category).brandName(brand).basePrice(new BigDecimal(price)).isActive(true).createdAt(Instant.now()).build(); return productRepository.saveAndFlush(product); }
    private void updateProductWithVector(Product product, List<ProductVariant> variants) { StringBuilder embeddingBuilder = new StringBuilder(); embeddingBuilder.append("Tên: ").append(product.getName()).append(". "); embeddingBuilder.append("Mô tả: ").append(product.getDescription()).append(". "); embeddingBuilder.append("Hãng: ").append(product.getBrandName()).append(". "); if (variants != null && !variants.isEmpty()) { Set<String> colors = variants.stream().map(ProductVariant::getColor).collect(Collectors.toSet()); Set<String> materials = variants.stream().map(ProductVariant::getMaterial).collect(Collectors.toSet()); Set<String> sizes = variants.stream().map(ProductVariant::getSize).collect(Collectors.toSet()); if (!colors.isEmpty()) embeddingBuilder.append("Các màu sắc: ").append(String.join(", ", colors)).append(". "); if (!materials.isEmpty()) embeddingBuilder.append("Chất liệu: ").append(String.join(", ", materials)).append(". "); if (!sizes.isEmpty()) embeddingBuilder.append("Các cỡ: ").append(String.join(", ", sizes)).append(". "); } Embedding embedding = embeddingModel.embed(embeddingBuilder.toString()).content(); float[] vector = embedding.vector(); String vectorString = IntStream.range(0, vector.length).mapToObj(i -> String.valueOf(vector[i])).collect(Collectors.joining(",", "[", "]")); product.setVectorEmbedding(vectorString); productRepository.save(product); }
    private Role getOrSaveRole(String roleName) { return roleRepository.findByRoleName(roleName).orElseGet(() -> roleRepository.save(Role.builder().roleName(roleName).build())); }
    private Category getOrSaveCategory(String name, Category parent) { return categoryRepository.findByName(name).orElseGet(() -> categoryRepository.save(Category.builder().name(name).parent(parent).build())); }
    private ProductImage createProductImage(Product product, String imageUrl, boolean isThumbnail) { return productImageRepository.save(ProductImage.builder().product(product).imageUrl(imageUrl).isThumbnail(isThumbnail).build()); }
    private ProductVariant createProductVariant(Product product, String sku, String color, String size, String material, String priceOverride, int stock) { return productVariantRepository.save(ProductVariant.builder().product(product).sku(sku).color(color).size(size).material(material).priceOverride(priceOverride != null ? new BigDecimal(priceOverride) : null).stockQuantity(stock).build()); }
    private Order createOrder(User user, String notes, String status) { Map<String, String> address = Map.of("fullName", user.getFullName(), "phone", user.getPhone(), "address", user.getAddress(), "notes", notes); String addressJson = ""; try { addressJson = objectMapper.writeValueAsString(address); } catch (Exception e) { log.error("Error serializing address", e); } Order order = Order.builder().user(user).status(status).shippingAddressJson(addressJson).shippingProvider("GHTK").createdAt(Instant.now()).totalAmount(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO).finalAmount(BigDecimal.ZERO).build(); return orderRepository.save(order); }
    private OrderItem createOrderItem(Order order, ProductVariant variant, int quantity, BigDecimal priceAtPurchase) { return orderItemRepository.save(OrderItem.builder().order(order).productVariant(variant).quantity(quantity).priceAtPurchase(priceAtPurchase).build()); }
    private void updateOrderTotals(Order order) { List<OrderItem> items = orderItemRepository.findByOrder(order); BigDecimal total = items.stream().map(item -> item.getPriceAtPurchase().multiply(new BigDecimal(item.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add); order.setTotalAmount(total); order.setFinalAmount(total.subtract(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO)); orderRepository.save(order); }
    private Payment createPayment(Order order, User user, String method, String status, String transactionCode) { return paymentRepository.save(Payment.builder().order(order).user(user).method(method).status(status).transactionCode(transactionCode).paidAt(status.equals("SUCCESS") ? Instant.now() : null).build()); }
    private Review createReview(User user, OrderItem orderItem, int rating, String comment) { return reviewRepository.save(Review.builder().user(user).orderItem(orderItem).rating(rating).comment(comment).createdAt(Instant.now()).build()); }
}
