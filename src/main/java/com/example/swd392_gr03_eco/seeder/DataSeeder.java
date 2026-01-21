package com.example.swd392_gr03_eco.seeder;

import com.example.swd392_gr03_eco.model.entities.*;
import com.example.swd392_gr03_eco.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    // Inject all repositories
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordEncoder passwordEncoder;
    private final SupplierRepository supplierRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final UserAddressRepository userAddressRepository;
    private final OrderRepository orderRepository;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;
    private final ComplaintRepository complaintRepository;
    private final ComplaintMessageRepository complaintMessageRepository;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (roleRepository.count() == 0) {
            System.out.println("Database is empty. Seeding data...");
            seedDatabase();
            System.out.println("Data seeding completed.");
        } else {
            System.out.println("Database is not empty. Skipping seeder.");
        }
    }

    private void seedDatabase() {
        // 1. Roles
        Role adminRole = roleRepository.save(Role.builder().roleName("ADMIN").build());
        Role staffRole = roleRepository.save(Role.builder().roleName("STAFF").build());
        Role customerRole = roleRepository.save(Role.builder().roleName("CUSTOMER").build());

        // 2. Users
        User adminUser = createUser("Admin User", "admin@example.com", "000000001", adminRole);
        User staffUser = createUser("Staff User", "staff@example.com", "000000002", staffRole);
        User customerUser = createUser("Customer User", "customer@example.com", "000000003", customerRole);

        // 3. Address for Customer
        userAddressRepository.save(UserAddress.builder().user(customerUser).addressLine("123 Main Street").city("Springfield").isDefault(true).build());

        // 4. Categories
        Category catApparel = categoryRepository.save(Category.builder().name("Apparel").build());
        Category catBottoms = categoryRepository.save(Category.builder().name("Bottoms").build());
        Category catTShirts = categoryRepository.save(Category.builder().name("T-Shirts").parent(catApparel).build());
        Category catJeans = categoryRepository.save(Category.builder().name("Jeans").parent(catBottoms).build());

        // 5. Products, Variants, Images, and Inventory
        Product tShirt = createProduct("Cotton Round Neck T-Shirt", "Made from 100% breathable cotton", catTShirts, "Coolmate", "250000");
        ProductVariant tShirtVariant = createProductVariant(tShirt, "CM-TS-RED-M", "Red", "M", 50);

        Product jeans = createProduct("Slim-fit Jeans", "Slim fit, good stretch", catJeans, "Levi's", "1200000");
        ProductVariant jeansVariant = createProductVariant(jeans, "LV-JN-BLU-30", "Blue", "30", 40);

        // 6. A Completed Order
        Order completedOrder = Order.builder()
                .user(customerUser)
                .totalAmount(new BigDecimal("1450000"))
                .finalAmount(new BigDecimal("1450000"))
                .status("COMPLETED")
                .shippingAddressJson("{\"fullName\":\"Customer User\",\"phone\":\"0111222333\",\"address\":\"123 Main Street, Springfield\"}")
                .shippingProvider("Fast Delivery Inc.")
                .trackingCode("FDI123456")
                .createdAt(Timestamp.from(Instant.now().minus(5, java.time.temporal.ChronoUnit.DAYS)))
                .build();
        
        OrderItem item1 = OrderItem.builder().order(completedOrder).productVariant(tShirtVariant).quantity(1).priceAtPurchase(tShirt.getBasePrice()).build();
        OrderItem item2 = OrderItem.builder().order(completedOrder).productVariant(jeansVariant).quantity(1).priceAtPurchase(jeans.getBasePrice()).build();
        completedOrder.getOrderItems().addAll(List.of(item1, item2));
        orderRepository.save(completedOrder);

        // 7. Payment for the Order
        paymentRepository.save(Payment.builder().order(completedOrder).method("COD").status("SUCCESS").transactionCode("COD123").build());

        // 8. Review from the customer
        reviewRepository.save(Review.builder().user(customerUser).product(tShirt).rating(5).comment("Great shirt, very comfortable fabric!").build());

        // 9. Complaint Flow
        Complaint complaint = Complaint.builder()
                .user(customerUser)
                .order(completedOrder)
                .title("Jeans arrived torn")
                .description("I received the order today and found a small tear on the knee of the jeans.")
                .status("OPEN")
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
        complaintRepository.save(complaint);

        complaintMessageRepository.save(ComplaintMessage.builder().complaint(complaint).user(customerUser).message("Could you please look into this for me?").build());
        complaintMessageRepository.save(ComplaintMessage.builder().complaint(complaint).user(staffUser).message("Hello, we apologize for the inconvenience. Could you please send us a photo of the product?").build());
    }

    private User createUser(String fullName, String email, String phone, Role role) {
        User user = User.builder()
                .fullName(fullName)
                .email(email)
                .passwordHash(passwordEncoder.encode("password"))
                .phone(phone)
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
        userRepository.save(user);
        userRoleRepository.save(UserRole.builder().user(user).role(role).build());
        return user;
    }

    private Product createProduct(String name, String desc, Category cat, String brand, String price) {
        Product product = Product.builder()
                .name(name)
                .description(desc)
                .category(cat)
                .brandName(brand)
                .basePrice(new BigDecimal(price))
                .isActive(true)
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
        product.getProductImages().add(ProductImage.builder().product(product).imageUrl("https://via.placeholder.com/150").isThumbnail(true).build());
        return productRepository.save(product);
    }

    private ProductVariant createProductVariant(Product product, String sku, String color, String size, int stock) {
        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .sku(sku)
                .color(color)
                .size(size)
                .stockQuantity(stock)
                .build();
        product.getProductVariants().add(variant);
        return variant; // Will be saved by cascade from product
    }
}
