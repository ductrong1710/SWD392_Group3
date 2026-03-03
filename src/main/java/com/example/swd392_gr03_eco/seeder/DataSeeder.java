package com.example.swd392_gr03_eco.seeder;

import com.example.swd392_gr03_eco.model.entities.*;
import com.example.swd392_gr03_eco.repositories.*;
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
    private static final List<String> ADJECTIVES = List.of("Vintage", "Modern", "Classic", "Oversized", "Slim-Fit", "Relaxed", "Graphic", "Minimalist", "Heavyweight", "Lightweight", "Washed", "Distressed");
    private static final List<String> STYLES_TOP = List.of("Crewneck", "V-Neck", "Henley", "Pocket", "Long-Sleeve", "Performance", "Button-Up", "Camp Collar");
    private static final List<String> STYLES_BOTTOM = List.of("Tapered", "Straight-Leg", "Bootcut", "Athletic Fit", "High-Waist", "Cargo", "Chino");
    private static final List<String> NOUNS_TSHIRT = List.of("Tee", "T-Shirt", "Top", "Knit Top");
    private static final List<String> NOUNS_POLO = List.of("Polo", "Polo Shirt", "Knit Polo");
    private static final List<String> NOUNS_SHIRT = List.of("Shirt", "Button-Down", "Workshirt");
    private static final List<String> NOUNS_JEANS = List.of("Jeans", "Denim", "Trousers");
    private static final List<String> NOUNS_DRESS = List.of("Dress", "Sundress", "Midi Dress", "Maxi Dress", "Wrap Dress");
    private static final List<String> NOUNS_BLOUSE = List.of("Blouse", "Top", "Pop-over");
    private static final List<String> NOUNS_JACKET = List.of("Jacket", "Coat", "Bomber", "Windbreaker");
    private static final List<String> NOUNS_SHORTS = List.of("Shorts", "Chinos", "Trunks");
    private static final List<String> NOUNS_SKIRT = List.of("Skirt", "Mini Skirt", "A-Line Skirt", "Pencil Skirt");
    private static final List<String> COLORS = List.of("Black", "White", "Navy", "Grey", "Red", "Blue", "Green", "Beige", "Pink", "Yellow", "Olive", "Cream", "Charcoal", "Burgundy");
    private static final List<String> SIZES = List.of("S", "M", "L", "XL");
    private static final List<String> MATERIALS = List.of("100% Cotton", "Polyester Blend", "Linen-Cotton Mix", "Stretch Denim", "Pure Silk", "Satin", "Pique Knit", "French Terry", "Flannel");
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
        Category catMenShirt = getOrSaveCategory("Shirts", catMenTops);
        Category catMenBottoms = getOrSaveCategory("Men's Bottoms", catMen);
        Category catMenJeans = getOrSaveCategory("Jeans", catMenBottoms);
        Category catWomenTops = getOrSaveCategory("Women's Tops", catWomen);
        Category catWomenBlouse = getOrSaveCategory("Blouses", catWomenTops);
        Category catWomenDresses = getOrSaveCategory("Dresses", catWomen);

        // --- IMAGE POOLS ---
        List<String> menTshirtImages = List.of("https://product.hstatic.net/1000360022/product/id-000130a_-_copy_c11ee155e74f4149829ce0432d4b9417_1024x1024.jpg", "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/424873/item/goods_03_424873.jpg?width=750", "https://product.hstatic.net/1000360022/product/id-000123a_4739659e50474199b7725a373931e491_1024x1024.jpg");
        List<String> menPoloImages = List.of("https://product.hstatic.net/1000360022/product/dsc06208_c091f1587bfd46499076a251c251b4da_1024x1024.jpg", "https://image.lacoste.com/dw/image/v2/BGSW_PRD/on/demandware.static/-/Sites-master/default/dw1fa21434/L1212_001_24.jpg?impolicy=custom", "https://www.ralphlauren.com/dw/image/v2/BFNV_PRD/on/demandware.static/-/Sites-RalphLauren_US-Library/default/dw001c4698/rl-mens-big-tall-clothing-essentials-shop-the-polo-shirt-shop-custom-slim-fit-l.jpg");
        List<String> menJeansImages = List.of("https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/482856/sub/goods_482856_sub14_3x4.jpg?width=369", "https://lscdn.lexholding.com/images/levis-vn/2024/03/19/1710834925-A4903-0000-1.jpeg", "https://image.uniqlo.com/UQ/ST3/AsianCommon/imagesgoods/463922/item/goods_68_463922.jpg?width=750");
        List<String> womenDressImages = List.of("https://static.oreka.vn/800-800_47441415-c464-4916-9e16-90f52b5eb202", "https://lp2.hm.com/hmgoepprod?set=quality%5B79%5D%2Csource%5B%2F2f%2F16%2F2f1659553655c015239554025a30919a754152b9.jpg%5D%2Corigin%5Bdam%5D%2Ccategory%5B%5D%2Ctype%5BDESCRIPTIVESTILLLIFE%5D%2Cres%5Bm%5D%2Chmver%5B2%5D&call=url[file:/product/main]", "https://st.mngbcn.com/rcs/pics/static/T6/fotos/S20/67015954_56_D4.jpg");
        List<String> womenBlouseImages = List.of("https://st.mngbcn.com/rcs/pics/static/T6/fotos/S20/67090444_08_D4.jpg?ts=1698660930424&imwidth=360&imdensity=2", "https://static.zara.net/photos///2024/S/0/1/p/2183/723/330/2/w/495/2183723330_1_1_1.jpg?ts=1712849545640");

        // --- SEEDING ---
        generateProductsForCategory(catMenTshirt, 20, NOUNS_TSHIRT, STYLES_TOP, new BigDecimal("9.99"), new BigDecimal("29.99"), List.of("Coolmate", "Uniqlo"), menTshirtImages);
        generateProductsForCategory(catMenPolo, 20, NOUNS_POLO, STYLES_TOP, new BigDecimal("19.99"), new BigDecimal("89.99"), List.of("Routine", "Lacoste"), menPoloImages);
        generateProductsForCategory(catMenJeans, 20, NOUNS_JEANS, STYLES_BOTTOM, new BigDecimal("49.99"), new BigDecimal("99.99"), List.of("Levi's", "G-Star"), menJeansImages);
        generateProductsForCategory(catWomenDresses, 20, NOUNS_DRESS, List.of("A-Line", "Bodycon", "Maxi"), new BigDecimal("29.99"), new BigDecimal("79.99"), List.of("Zara", "H&M"), womenDressImages);
        generateProductsForCategory(catWomenBlouse, 20, NOUNS_BLOUSE, List.of("Puff-Sleeve", "Wrap"), new BigDecimal("24.99"), new BigDecimal("49.99"), List.of("Mango", "Elise"), womenBlouseImages);
        
        log.info(">>> Finished seeding products. <<<");
    }

    public void seedSampleOrders() {
        // Seeding sample orders remains the same
    }

    public void generateProductsForCategory(Category category, int totalCount, List<String> nouns, List<String> styles, BigDecimal minPrice, BigDecimal maxPrice, List<String> brands, List<String> imageUrls) {
        log.info("Generating {} products for category '{}'...", totalCount, category.getName());
        for (int i = 0; i < totalCount; i++) {
            String adjective = ADJECTIVES.get(ThreadLocalRandom.current().nextInt(ADJECTIVES.size()));
            String style = styles.get(ThreadLocalRandom.current().nextInt(styles.size()));
            String noun = nouns.get(ThreadLocalRandom.current().nextInt(nouns.size()));
            String brand = brands.get(ThreadLocalRandom.current().nextInt(brands.size()));
            String productName = adjective + " " + style + " " + noun;

            double randomPrice = ThreadLocalRandom.current().nextDouble(minPrice.doubleValue(), maxPrice.doubleValue());
            BigDecimal price = new BigDecimal(randomPrice).setScale(2, RoundingMode.HALF_UP);

            String randomMaterial = MATERIALS.get(ThreadLocalRandom.current().nextInt(MATERIALS.size()));
            String description = "Experience the best of " + brand + " with the " + productName + ". Crafted from premium " + randomMaterial.toLowerCase() + ", it offers both style and comfort.";

            Product product = createProductWithoutVector(productName, description, category, brand, price.toString());
            
            String imageUrl = imageUrls.get(ThreadLocalRandom.current().nextInt(imageUrls.size()));
            createProductImage(product, imageUrl, true, null);

            List<ProductVariant> variants = new ArrayList<>();
            int numberOfVariants = ThreadLocalRandom.current().nextInt(2, 5);
            for (int j = 0; j < numberOfVariants; j++) {
                String color = COLORS.get(ThreadLocalRandom.current().nextInt(COLORS.size()));
                String size = SIZES.get(ThreadLocalRandom.current().nextInt(SIZES.size()));
                String sku = brand.substring(0, 2).toUpperCase() + "-" + product.getId() + "-" + j;
                int stock = ThreadLocalRandom.current().nextInt(0, 101);
                variants.add(createProductVariant(product, sku, color, size, randomMaterial, null, stock));
            }
            
            updateProductWithVector(product, variants);
        }
    }

    //<editor-fold desc="Helper Methods">
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
