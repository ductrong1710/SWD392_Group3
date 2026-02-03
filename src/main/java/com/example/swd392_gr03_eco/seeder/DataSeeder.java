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
        createUserIfNotExist("Main Admin", "admin@example.com", "0901000001", "123456", adminRole);
        createUserIfNotExist("Sales Staff", "staff@example.com", "0901000002", "123456", staffRole);
        User customer1 = createUserIfNotExist("Nguyen Van A", "customer@example.com", "0901000003", "123456", customerRole);
        User customer2 = createUserIfNotExist("Tran Thi B", "customer2@example.com", "0901000004", "123456", customerRole);

        // 2. SEED CLOTHING CATEGORIES
        Category catMen = getOrSaveCategory("Thời trang nam", null);
        Category catWomen = getOrSaveCategory("Thời trang nữ", null);
        Category catMenTshirt = getOrSaveCategory("Áo Thun Nam", catMen);
        Category catMenPolo = getOrSaveCategory("Áo Polo Nam", catMen);
        Category catMenShirt = getOrSaveCategory("Áo Sơ Mi Nam", catMen);
        Category catMenJacket = getOrSaveCategory("Áo Khoác Nam", catMen);
        Category catMenJeans = getOrSaveCategory("Quần Jeans Nam", catMen);
        Category catMenTrousers = getOrSaveCategory("Quần Tây Nam", catMen);
        Category catWomenTop = getOrSaveCategory("Áo Nữ", catWomen);
        Category catWomenDress = getOrSaveCategory("Váy Đầm", catWomen);
        Category catWomenSkirt = getOrSaveCategory("Chân Váy", catWomen);
        Category catWomenJeans = getOrSaveCategory("Quần Jeans Nữ", catWomen);

        // 3. SEED PRODUCTS & VARIANTS
        // Product 1: Basic T-Shirt
        Product p1 = createProductWithoutVector("Áo Thun Trơn Cotton Compact", "Áo thun cơ bản, vải cotton compact cao cấp, mềm mịn, thấm hút mồ hôi tốt và hạn chế xù lông.", catMenTshirt, "Coolmate", "239000");
        createProductImage(p1, "https://product.hstatic.net/1000360022/product/id-000130a_-_copy_c11ee155e74f4149829ce0432d4b9417_1024x1024.jpg", true);
        createProductImage(p1, "https://product.hstatic.net/1000360022/product/id-000123a_4739659e50474199b7725a373931e491_1024x1024.jpg", false);
        createProductImage(p1, "https://product.hstatic.net/1000360022/product/id-000127a_-_copy_ba6c727c6b8847b8a9341962d92cd133_1024x1024.jpg", false);
        createProductImage(p1, "https://product.hstatic.net/1000360022/product/id-000135a_-_copy_47f8bcd54fc84e3a8cbb0e3da28a39fd_1024x1024.jpg", false);
        List<ProductVariant> p1Variants = List.of(
            createProductVariant(p1, "CM-TS-BLK-M", "Đen", "M", "Cotton Compact", null, 150),
            createProductVariant(p1, "CM-TS-WHT-L", "Trắng", "L", "Cotton Compact", null, 180)
        );
        updateProductWithVector(p1, p1Variants);

        // Product 2: Polo Shirt
        Product p2 = createProductWithoutVector("Áo Polo Cafe-Knit", "Áo polo nam sử dụng công nghệ dệt từ bã cafe, giúp khử mùi, nhanh khô và chống tia UV.", catMenPolo, "Routine", "450000");
        createProductImage(p2, "https://product.hstatic.net/1000360022/product/dsc06208_c091f1587bfd46499076a251c251b4da_1024x1024.jpg", true);
        createProductImage(p2, "https://cdn.hstatic.net/products/1000360022/img_6560_97595e41736c46b5b6e85ef61918b0d8_1024x1024.jpg", false);
        createProductImage(p2, "https://cdn.hstatic.net/products/1000360022/img_6562_6b01c08845794ce49060299f5d5d037f_1024x1024.jpg", false);
        createProductImage(p2, "https://cdn.hstatic.net/products/1000360022/img_6558_b6d0da786a8343a487f0be7268725629_1024x1024.jpg", false);
        createProductImage(p2, "https://cdn.hstatic.net/products/1000360022/img_6564_e8e0e94727a3473bb922f5777bcfaeb6_1024x1024.jpg", false);
        List<ProductVariant> p2Variants = List.of(
            createProductVariant(p2, "RT-PL-GRY-L", "Xám", "L", "Vải Cafe-Knit", null, 70)
        );
        updateProductWithVector(p2, p2Variants);

        // Product 3: Men's Jeans
        Product p3 = createProductWithoutVector("Quần Jeans Nam 511 Slim Fit", "Dáng quần slim fit ôm vừa vặn, chất liệu denim co giãn thoải mái vận động.", catMenJeans, "Levi's", "1890000");
        createProductImage(p3, "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/482856/sub/goods_482856_sub14_3x4.jpg?width=369", true);
        createProductImage(p3, "https://product.hstatic.net/200000736253/product/z5553114651744_0b5986c3ca3368a4244713a499e3d279_ae48f18637cf4fb5bed8301c8dd965f9_master.jpg", false);
        List<ProductVariant> p3Variants = List.of(
            createProductVariant(p3, "LV-JN-511-32", "Xanh Đậm (Dark Indigo)", "32", "Denim-Elastane", null, 60)
        );
        updateProductWithVector(p3, p3Variants);

        // Product 4: Men's Dress Shirt
        Product p4 = createProductWithoutVector("Áo Sơ Mi Trắng Vải Bamboo", "Sơ mi công sở cao cấp, chất liệu sợi tre tự nhiên chống nhăn, kháng khuẩn và thoáng mát.", catMenShirt, "An Phuoc", "950000");
        createProductImage(p4, "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/456589/item/goods_60_456589_3x4.jpg?width=369", true);
        createProductImage(p4, "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/477834/item/goods_64_477834_3x4.jpg?width=369", false);
        createProductImage(p4, "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/478002/item/goods_66_478002_3x4.jpg?width=369", false);
        List<ProductVariant> p4Variants = List.of(
            createProductVariant(p4, "AP-SM-BMB-40", "Trắng", "40", "Vải Bamboo", null, 50)
        );
        updateProductWithVector(p4, p4Variants);

        // Product 5: Women's Dress
        Product p5 = createProductWithoutVector("Đầm Hoa Nhí Cổ Vuông", "Váy đầm dáng xòe nhẹ nhàng, họa tiết hoa nhí vintage, phù hợp đi chơi, dạo phố.", catWomenDress, "Zara", "1299000");
        createProductImage(p5, "https://static.oreka.vn/800-800_47441415-c464-4916-9e16-90f52b5eb202", true);
        List<ProductVariant> p5Variants = List.of(
            createProductVariant(p5, "ZR-DR-FLR-S", "Hoa nhí nền kem", "S", "Voan", null, 45)
        );
        updateProductWithVector(p5, p5Variants);

        // Product 6: Women's Skirt
        Product p6 = createProductWithoutVector("Chân Váy Chữ A Xếp Ly", "Chân váy công sở thanh lịch, dáng chữ A che khuyết điểm, có lớp lót trong.", catWomenSkirt, "Elise", "898000");
        createProductImage(p6, "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/484853/sub/goods_484853_sub14_3x4.jpg?width=369", true);
        List<ProductVariant> p6Variants = List.of(
            createProductVariant(p6, "EL-SK-BLK-S", "Đen", "S", "Vải Tuyết Mưa", null, 60)
        );
        updateProductWithVector(p6, p6Variants);

        // 4. SEED ORDERS
        Order order1 = createOrder(customer1, "Giao hàng nhanh", "PENDING");
        createOrderItem(order1, p1Variants.get(0), 1, p1.getBasePrice());
        createOrderItem(order1, p3Variants.get(0), 1, p3.getBasePrice());
        updateOrderTotals(order1);
        createPayment(order1, customer1, "COD", "PENDING", null);

        Order order2 = createOrder(customer2, "Giao tận nơi", "COMPLETED");
        OrderItem oi2_1 = createOrderItem(order2, p5Variants.get(0), 1, p5.getBasePrice());
        updateOrderTotals(order2);
        createPayment(order2, customer2, "VNPAY", "SUCCESS", "VNP123456");
        createReview(customer2, oi2_1, 5, "Váy rất đẹp, chất vải mát, form chuẩn!");

        log.info(">>> DATA SEEDING FINISHED SUCCESSFULLY <<<");
    }

    private Product createProductWithoutVector(String name, String desc, Category category, String brand, String price) {
        Product product = Product.builder()
                .name(name).description(desc).category(category)
                .brandName(brand).basePrice(new BigDecimal(price))
                .isActive(true).createdAt(Instant.now())
                .build();
        return productRepository.saveAndFlush(product);
    }
    
    private void updateProductWithVector(Product product, List<ProductVariant> variants) {
        StringBuilder embeddingBuilder = new StringBuilder();
        embeddingBuilder.append("Tên: ").append(product.getName()).append(". ");
        embeddingBuilder.append("Mô tả: ").append(product.getDescription()).append(". ");
        embeddingBuilder.append("Hãng: ").append(product.getBrandName()).append(". ");

        if (variants != null && !variants.isEmpty()) {
            Set<String> colors = variants.stream().map(ProductVariant::getColor).collect(Collectors.toSet());
            Set<String> materials = variants.stream().map(ProductVariant::getMaterial).collect(Collectors.toSet());
            Set<String> sizes = variants.stream().map(ProductVariant::getSize).collect(Collectors.toSet());

            if (!colors.isEmpty()) embeddingBuilder.append("Các màu sắc: ").append(String.join(", ", colors)).append(". ");
            if (!materials.isEmpty()) embeddingBuilder.append("Chất liệu: ").append(String.join(", ", materials)).append(". ");
            if (!sizes.isEmpty()) embeddingBuilder.append("Các cỡ: ").append(String.join(", ", sizes)).append(". ");
        }
        
        Embedding embedding = embeddingModel.embed(embeddingBuilder.toString()).content();
        float[] vector = embedding.vector();
        String vectorString = IntStream.range(0, vector.length)
                                     .mapToObj(i -> String.valueOf(vector[i]))
                                     .collect(Collectors.joining(",", "[", "]"));
        product.setVectorEmbedding(vectorString);
        productRepository.save(product);
    }

    private Role getOrSaveRole(String roleName) { return roleRepository.findByRoleName(roleName).orElseGet(() -> roleRepository.save(Role.builder().roleName(roleName).build())); }
    private User createUserIfNotExist(String name, String email, String phone, String password, Role role) { return userRepository.findByEmail(email).orElseGet(() -> { User user = User.builder().fullName(name).email(email).phone(phone).passwordHash(passwordEncoder.encode(password)).isActive(true).createdAt(Instant.now()).role(role).build(); log.info("Created user: " + email); return userRepository.save(user); }); }
    private Category getOrSaveCategory(String name, Category parent) { return categoryRepository.findByName(name).orElseGet(() -> categoryRepository.save(Category.builder().name(name).parent(parent).build())); }
    private ProductImage createProductImage(Product product, String imageUrl, boolean isThumbnail) { return productImageRepository.save(ProductImage.builder().product(product).imageUrl(imageUrl).isThumbnail(isThumbnail).build()); }
    private ProductVariant createProductVariant(Product product, String sku, String color, String size, String material, String priceOverride, int stock) { return productVariantRepository.save(ProductVariant.builder().product(product).sku(sku).color(color).size(size).material(material).priceOverride(priceOverride != null ? new BigDecimal(priceOverride) : null).stockQuantity(stock).build()); }
    private Order createOrder(User user, String notes, String status) { Map<String, String> address = Map.of("fullName", user.getFullName(), "phone", user.getPhone(), "address", "123 Duong ABC, Phuong XYZ, Quan 1", "city", "Ho Chi Minh", "notes", notes); String addressJson = ""; try { addressJson = objectMapper.writeValueAsString(address); } catch (Exception e) { log.error("Error serializing address", e); } Order order = Order.builder().user(user).status(status).shippingAddressJson(addressJson).shippingProvider("GHTK").createdAt(Instant.now()).totalAmount(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO).finalAmount(BigDecimal.ZERO).build(); return orderRepository.save(order); }
    private OrderItem createOrderItem(Order order, ProductVariant variant, int quantity, BigDecimal priceAtPurchase) { return orderItemRepository.save(OrderItem.builder().order(order).productVariant(variant).quantity(quantity).priceAtPurchase(priceAtPurchase).build()); }
    private void updateOrderTotals(Order order) { List<OrderItem> items = orderItemRepository.findByOrder(order); BigDecimal total = items.stream().map(item -> item.getPriceAtPurchase().multiply(new BigDecimal(item.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add); order.setTotalAmount(total); order.setFinalAmount(total.subtract(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO)); orderRepository.save(order); }
    private Payment createPayment(Order order, User user, String method, String status, String transactionCode) { return paymentRepository.save(Payment.builder().order(order).user(user).method(method).status(status).transactionCode(transactionCode).paidAt(status.equals("SUCCESS") ? Instant.now() : null).build()); }
    private Review createReview(User user, OrderItem orderItem, int rating, String comment) { return reviewRepository.save(Review.builder().user(user).orderItem(orderItem).rating(rating).comment(comment).createdAt(Instant.now()).build()); }
}
