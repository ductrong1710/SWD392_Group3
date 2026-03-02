package com.example.swd392_gr03_eco.seeder;

import com.example.swd392_gr03_eco.model.entities.*;
import com.example.swd392_gr03_eco.repositories.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.langchain4j.data.embedding.Embedding;
import dev.langchain4j.model.embedding.EmbeddingModel;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.*;
import java.util.concurrent.ThreadLocalRandom;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    //<editor-fold desc="Repositories and Services">
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
    //</editor-fold>

    //<editor-fold desc="Data for Random Generation">
    private static final List<String> SIZES = List.of("S", "M", "L", "XL");
    //</editor-fold>

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            log.info(">>> Data already exists. Skipping seeding. <<<");
            return;
        }
        log.info(">>> No data found. Starting data seeding... <<<");
        seedCoreData();
        seedAllProducts();
        seedSampleOrders();
        log.info(">>> DATA SEEDING FINISHED SUCCESSFULLY <<<");
    }

    public void seedCoreData() {
        log.info("Seeding Roles and Users...");
        Role adminRole = getOrSaveRole("ADMIN");
        Role customerRole = getOrSaveRole("CUSTOMER");
        createUserIfNotExist("Main Admin", "admin@example.com", "0901000001", "123 Main St, HCMC", "123456", adminRole);
        createUserIfNotExist("John Doe", "customer@example.com", "0901000003", "789 Nguyen Trai St, HCMC", "123456", customerRole);
    }

    public void seedAllProducts() {
        log.info(">>> Seeding products automatically...");
        // --- CATEGORIES ---
        Category catMen = getOrSaveCategory("Men's Fashion", null);
        Category catWomen = getOrSaveCategory("Women's Fashion", null);
        Category catMenTops = getOrSaveCategory("Men's Tops", catMen);
        Category catMenTshirt = getOrSaveCategory("T-Shirts", catMenTops);
        Category catMenPolo = getOrSaveCategory("Polo Shirts", catMenTops);
        Category catMenBottoms = getOrSaveCategory("Men's Bottoms", catMen);
        Category catMenJeans = getOrSaveCategory("Jeans", catMenBottoms);
        Category catWomenTops = getOrSaveCategory("Women's Tops", catWomen);
        Category catWomenBlouse = getOrSaveCategory("Blouses", catWomenTops);
        Category catWomenDresses = getOrSaveCategory("Dresses", catWomen);

        // --- PRODUCT BLUEPRINTS ---
        List<ProductBlueprint> menTshirtBlueprints = List.of(
            new ProductBlueprint("U Crew Neck T-Shirt", List.of("Uniqlo"), new BigDecimal("14.90"), new BigDecimal("19.90"), "100% Cotton", Map.of("White", "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/424873/item/goods_00_424873.jpg", "Black", "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/424873/item/goods_09_424873.jpg")),
            new ProductBlueprint("Graphic Print Tee", List.of("Coolmate"), new BigDecimal("12.99"), new BigDecimal("25.00"), "100% Cotton", Map.of("Black", "https://product.hstatic.net/1000360022/product/id-000130a_-_copy_c11ee155e74f4149829ce0432d4b9417_1024x1024.jpg")),
            new ProductBlueprint("Dri-FIT Training Tee", List.of("Nike", "Adidas"), new BigDecimal("25.00"), new BigDecimal("40.00"), "Polyester Blend", Map.of("Grey", "https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/a055c54c-c535-4993-a419-73b406543442/dri-fit-mens-training-t-shirt-v24VqM.png"))
        );
        List<ProductBlueprint> menPoloBlueprints = List.of(
            new ProductBlueprint("Classic Piqué Polo", List.of("Lacoste", "Ralph Lauren"), new BigDecimal("89.00"), new BigDecimal("110.00"), "Pique Knit", Map.of("Navy", "https://image.lacoste.com/dw/image/v2/BGSW_PRD/on/demandware.static/-/Sites-master/default/dw4a013364/L1212_166_24.jpg", "White", "https://image.lacoste.com/dw/image/v2/BGSW_PRD/on/demandware.static/-/Sites-master/default/dw1fa21434/L1212_001_24.jpg")),
            new ProductBlueprint("AIRism Polo", List.of("Uniqlo"), new BigDecimal("29.90"), new BigDecimal("35.90"), "Polyester Blend", Map.of("Black", "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/465201/item/goods_09_465201.jpg"))
        );
        List<ProductBlueprint> womenDressBlueprints = List.of(
            new ProductBlueprint("Linen Blend Midi Dress", List.of("Zara", "Mango"), new BigDecimal("59.90"), new BigDecimal("79.90"), "Linen-Cotton Mix", Map.of("Beige", "https://static.zara.net/photos///2024/V/0/1/p/8372/063/330/2/w/600/8372063330_1_1_1.jpg", "Black", "https://static.zara.net/photos///2024/V/0/1/p/8372/063/800/2/w/600/8372063800_1_1_1.jpg")),
            new ProductBlueprint("Rib-knit Bodycon Dress", List.of("H&M"), new BigDecimal("19.99"), new BigDecimal("34.99"), "Polyester Blend", Map.of("Black", "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F2f%2F16%2F2f1659553655c015239554025a30919a754152b9.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]"))
        );

        // --- SEEDING ---
        generateProductsForCategory(catMenTshirt, 10, menTshirtBlueprints);
        generateProductsForCategory(catMenPolo, 10, menPoloBlueprints);
        generateProductsForCategory(catWomenDresses, 10, womenDressBlueprints);
        
        log.info(">>> Finished seeding products. <<<");
    }

    public void seedSampleOrders() {
        // Seeding sample orders remains the same
    }

    public void generateProductsForCategory(Category category, int totalCount, List<ProductBlueprint> blueprints) {
        log.info("Generating {} products for category '{}'...", totalCount, category.getName());
        for (int i = 0; i < totalCount; i++) {
            ProductBlueprint blueprint = blueprints.get(ThreadLocalRandom.current().nextInt(blueprints.size()));
            
            String brand = blueprint.getBrands().get(ThreadLocalRandom.current().nextInt(blueprint.getBrands().size()));
            String name = brand + " " + blueprint.getBaseName() + " #" + (i + 1);
            String description = "A high-quality " + blueprint.getBaseName().toLowerCase() + " from " + brand + ". This piece features a modern design and is perfect for any occasion.";
            
            double randomPrice = ThreadLocalRandom.current().nextDouble(blueprint.getMinPrice().doubleValue(), blueprint.getMaxPrice().doubleValue());
            BigDecimal price = new BigDecimal(randomPrice).setScale(2, RoundingMode.HALF_UP);

            Product product = createProductWithoutVector(name, description, category, brand, price.toString());

            List<ProductVariant> variants = new ArrayList<>();
            boolean isFirstImage = true;
            int variantCounter = 0; // Counter for unique SKU
            
            List<String> availableColors = new ArrayList<>(blueprint.getImageUrls().keySet());
            Collections.shuffle(availableColors);
            List<String> selectedColors = availableColors.stream().limit(2).collect(Collectors.toList());

            for (String color : selectedColors) {
                createProductImage(product, blueprint.getImageUrls().get(color), isFirstImage, color);
                isFirstImage = false;

                for (String size : SIZES) {
                    // FIX: Use a simple incrementing counter for guaranteed uniqueness per product
                    String sku = brand.substring(0, 2).toUpperCase() + "-" + product.getId() + "-" + variantCounter;
                    variantCounter++;

                    int stock = ThreadLocalRandom.current().nextInt(0, 101);
                    variants.add(createProductVariant(product, sku, color, size, blueprint.getMaterial(), null, stock));
                }
            }
            updateProductWithVector(product, variants);
        }
    }

    //<editor-fold desc="Data Structures and Helper Methods">
    @Data @Builder
    private static class ProductBlueprint {
        String baseName;
        List<String> brands;
        BigDecimal minPrice;
        BigDecimal maxPrice;
        String material;
        Map<String, String> imageUrls; // Color -> Image URL
    }

    private User createUserIfNotExist(String name, String email, String phone, String address, String password, Role role) { return userRepository.save(User.builder().fullName(name).email(email).phone(phone).address(address).passwordHash(passwordEncoder.encode(password)).isActive(true).createdAt(Instant.now()).role(role).build()); }
    private Product createProductWithoutVector(String name, String desc, Category category, String brand, String price) { Product product = Product.builder().name(name).description(desc).category(category).brandName(brand).basePrice(new BigDecimal(price)).isActive(true).createdAt(Instant.now()).build(); return productRepository.saveAndFlush(product); }
    private void updateProductWithVector(Product product, List<ProductVariant> variants) { StringBuilder embeddingBuilder = new StringBuilder(); embeddingBuilder.append("Name: ").append(product.getName()).append(". "); embeddingBuilder.append("Description: ").append(product.getDescription()).append(". "); embeddingBuilder.append("Brand: ").append(product.getBrandName()).append(". "); if (variants != null && !variants.isEmpty()) { Set<String> colors = variants.stream().map(ProductVariant::getColor).collect(Collectors.toSet()); Set<String> materials = variants.stream().map(ProductVariant::getMaterial).collect(Collectors.toSet()); Set<String> sizes = variants.stream().map(ProductVariant::getSize).collect(Collectors.toSet()); if (!colors.isEmpty()) embeddingBuilder.append("Available colors: ").append(String.join(", ", colors)).append(". "); if (!materials.isEmpty()) embeddingBuilder.append("Materials: ").append(String.join(", ", materials)).append(". "); if (!sizes.isEmpty()) embeddingBuilder.append("Available sizes: ").append(String.join(", ", sizes)).append(". "); } Embedding embedding = embeddingModel.embed(embeddingBuilder.toString()).content(); float[] vector = embedding.vector(); String vectorString = IntStream.range(0, vector.length).mapToObj(i -> String.valueOf(vector[i])).collect(Collectors.joining(",", "[", "]")); product.setVectorEmbedding(vectorString); productRepository.saveAndFlush(product); }
    private Role getOrSaveRole(String roleName) { return roleRepository.findByRoleName(roleName).orElseGet(() -> roleRepository.save(Role.builder().roleName(roleName).build())); }
    private Category getOrSaveCategory(String name, Category parent) { return categoryRepository.findByName(name).orElseGet(() -> categoryRepository.save(Category.builder().name(name).parent(parent).build())); }
    private ProductImage createProductImage(Product product, String imageUrl, boolean isThumbnail, String color) { return productImageRepository.save(ProductImage.builder().product(product).imageUrl(imageUrl).isThumbnail(isThumbnail).color(color).build()); }
    private ProductVariant createProductVariant(Product product, String sku, String color, String size, String material, String priceOverride, int stock) { return productVariantRepository.save(ProductVariant.builder().product(product).sku(sku).color(color).size(size).material(material).priceOverride(priceOverride != null ? new BigDecimal(priceOverride) : null).stockQuantity(stock).build()); }
    private Order createOrder(User user, String notes, String status) { Map<String, String> address = Map.of("fullName", user.getFullName(), "phone", user.getPhone(), "address", user.getAddress(), "notes", notes); String addressJson = ""; try { addressJson = objectMapper.writeValueAsString(address); } catch (Exception e) { log.error("Error serializing address", e); } Order order = Order.builder().user(user).status(status).shippingAddressJson(addressJson).shippingProvider("GHTK").createdAt(Instant.now()).totalAmount(BigDecimal.ZERO).discountAmount(BigDecimal.ZERO).finalAmount(BigDecimal.ZERO).build(); return orderRepository.save(order); }
    private OrderItem createOrderItem(Order order, ProductVariant variant, int quantity, BigDecimal priceAtPurchase) { return orderItemRepository.save(OrderItem.builder().order(order).productVariant(variant).quantity(quantity).priceAtPurchase(priceAtPurchase).build()); }
    private void updateOrderTotals(Order order) { List<OrderItem> items = orderItemRepository.findByOrder(order); BigDecimal total = items.stream().map(item -> item.getPriceAtPurchase().multiply(new BigDecimal(item.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add); order.setTotalAmount(total); order.setFinalAmount(total.subtract(order.getDiscountAmount() != null ? order.getDiscountAmount() : BigDecimal.ZERO)); orderRepository.save(order); }
    private Payment createPayment(Order order, User user, String method, String status, String transactionCode) { return paymentRepository.save(Payment.builder().order(order).user(user).method(method).status(status).transactionCode(transactionCode).paidAt(status.equals("SUCCESS") ? Instant.now() : null).build()); }
    private Review createReview(User user, OrderItem orderItem, int rating, String comment) { return reviewRepository.save(Review.builder().user(user).orderItem(orderItem).rating(rating).comment(comment).createdAt(Instant.now()).build()); }
    //</editor-fold>
}
