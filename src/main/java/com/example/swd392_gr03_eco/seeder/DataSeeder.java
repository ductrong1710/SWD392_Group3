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

        // 1. SEED ROLES & USERS
        Role adminRole = getOrSaveRole("ADMIN");
        Role staffRole = getOrSaveRole("STAFF");
        Role customerRole = getOrSaveRole("CUSTOMER");
        createUserIfNotExist("Main Admin", "admin@example.com", "0901000001", "123 Main St, District 1, HCMC", "123456", adminRole);
        createUserIfNotExist("Sales Staff", "staff@example.com", "0901000002", "456 Market St, District 3, HCMC", "123456", staffRole);
        User customer1 = createUserIfNotExist("John Doe", "customer@example.com", "0901000003", "789 Nguyen Trai St, District 5, HCMC", "123456", customerRole);
        User customer2 = createUserIfNotExist("Jane Smith", "customer2@example.com", "0901000004", "101 Le Loi St, District 1, HCMC", "123456", customerRole);

        // 2. SEED CLOTHING CATEGORIES
        Category catMen = getOrSaveCategory("Men's Fashion", null);
        Category catWomen = getOrSaveCategory("Women's Fashion", null);
        Category catMenTshirt = getOrSaveCategory("Men's T-Shirts", catMen);
        Category catMenPolo = getOrSaveCategory("Men's Polos", catMen);
        Category catMenShirt = getOrSaveCategory("Men's Shirts", catMen);
        Category catMenJeans = getOrSaveCategory("Men's Jeans", catMen);
        Category catWomenDress = getOrSaveCategory("Dresses", catWomen);
        Category catWomenSkirt = getOrSaveCategory("Skirts", catWomen);

        // 3. SEED PRODUCTS & VARIANTS (Prices in USD)
        Product p1 = createProductWithoutVector("Compact Cotton T-Shirt", "A basic t-shirt, premium compact cotton fabric, soft, absorbent, and pill-resistant.", catMenTshirt, "Coolmate", "9.99");
        createProductImage(p1, "https://product.hstatic.net/1000360022/product/id-000130a_-_copy_c11ee155e74f4149829ce0432d4b9417_1024x1024.jpg", true);
        List<ProductVariant> p1Variants = List.of(
            createProductVariant(p1, "CM-TS-BLK-M", "Black", "M", "Cotton Compact", null, 150),
            createProductVariant(p1, "CM-TS-WHT-L", "White", "L", "Cotton Compact", null, 180)
        );
        updateProductWithVector(p1, p1Variants);

        Product p2 = createProductWithoutVector("Cafe-Knit Polo Shirt", "Men's polo shirt using weaving technology from coffee grounds, helping to deodorize, dry quickly and resist UV rays.", catMenPolo, "Routine", "18.50");
        createProductImage(p2, "https://product.hstatic.net/1000360022/product/dsc06208_c091f1587bfd46499076a251c251b4da_1024x1024.jpg", true);
        List<ProductVariant> p2Variants = List.of(
            createProductVariant(p2, "RT-PL-GRY-L", "Gray", "L", "Cafe-Knit Fabric", null, 70)
        );
        updateProductWithVector(p2, p2Variants);

        Product p3 = createProductWithoutVector("Men's 511 Slim Fit Jeans", "Slim fit jeans that fit snugly, with stretchy denim material for comfortable movement.", catMenJeans, "Levi's", "79.99");
        createProductImage(p3, "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/482856/sub/goods_482856_sub14_3x4.jpg?width=369", true);
        List<ProductVariant> p3Variants = List.of(
            createProductVariant(p3, "LV-JN-511-32", "Dark Indigo", "32", "Denim-Elastane", null, 60)
        );
        updateProductWithVector(p3, p3Variants);

        Product p4 = createProductWithoutVector("White Bamboo Fabric Shirt", "High-end office shirt, natural bamboo fiber material is wrinkle-resistant, antibacterial and breathable.", catMenShirt, "An Phuoc", "39.00");
        createProductImage(p4, "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/456589/item/goods_60_456589_3x4.jpg?width=369", true);
        List<ProductVariant> p4Variants = List.of(
            createProductVariant(p4, "AP-SM-BMB-40", "White", "40", "Bamboo Fabric", null, 50)
        );
        updateProductWithVector(p4, p4Variants);

        Product p5 = createProductWithoutVector("Floral Print Square Neck Dress", "A-line dress with a gentle flare, vintage floral print, suitable for outings and walks.", catWomenDress, "Zara", "55.50");
        createProductImage(p5, "https://static.oreka.vn/800-800_47441415-c464-4916-9e16-90f52b5eb202", true);
        List<ProductVariant> p5Variants = List.of(
            createProductVariant(p5, "ZR-DR-FLR-S", "Cream Floral", "S", "Voile", null, 45)
        );
        updateProductWithVector(p5, p5Variants);

        // 4. SEED ORDERS
        Order order1 = createOrder(customer1, "Fast delivery", "PENDING");
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

    private Product createProductWithoutVector(String name, String desc, Category category, String brand, String price) { Product product = Product.builder().name(name).description(desc).category(category).brandName(brand).basePrice(new BigDecimal(price)).isActive(true).createdAt(Instant.now()).build(); return productRepository.saveAndFlush(product); }
    private void updateProductWithVector(Product product, List<ProductVariant> variants) { StringBuilder embeddingBuilder = new StringBuilder(); embeddingBuilder.append("Name: ").append(product.getName()).append(". "); embeddingBuilder.append("Description: ").append(product.getDescription()).append(". "); embeddingBuilder.append("Brand: ").append(product.getBrandName()).append(". "); if (variants != null && !variants.isEmpty()) { Set<String> colors = variants.stream().map(ProductVariant::getColor).collect(Collectors.toSet()); Set<String> materials = variants.stream().map(ProductVariant::getMaterial).collect(Collectors.toSet()); Set<String> sizes = variants.stream().map(ProductVariant::getSize).collect(Collectors.toSet()); if (!colors.isEmpty()) embeddingBuilder.append("Available colors: ").append(String.join(", ", colors)).append(". "); if (!materials.isEmpty()) embeddingBuilder.append("Materials: ").append(String.join(", ", materials)).append(". "); if (!sizes.isEmpty()) embeddingBuilder.append("Available sizes: ").append(String.join(", ", sizes)).append(". "); } Embedding embedding = embeddingModel.embed(embeddingBuilder.toString()).content(); float[] vector = embedding.vector(); String vectorString = IntStream.range(0, vector.length).mapToObj(i -> String.valueOf(vector[i])).collect(Collectors.joining(",", "[", "]")); product.setVectorEmbedding(vectorString); productRepository.save(product); }
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
