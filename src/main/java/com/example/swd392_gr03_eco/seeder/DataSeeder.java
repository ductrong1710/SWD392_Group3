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
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository productVariantRepository;
    private final ProductImageRepository productImageRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final UserAddressRepository userAddressRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final ReviewRepository reviewRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0 && categoryRepository.count() == 0) {
            seedDatabase();
        }
    }

    private void seedDatabase() {
        // 1. Seed Roles
        Role adminRole = Role.builder().roleName("ADMIN").build();
        Role customerRole = Role.builder().roleName("CUSTOMER").build();
        Role staffRole = Role.builder().roleName("STAFF").build();
        roleRepository.saveAll(List.of(adminRole, customerRole, staffRole));

        // 2. Seed Users
        User adminUser = User.builder()
                .fullName("Admin User")
                .email("admin@ecommerce.com")
                .passwordHash(passwordEncoder.encode("password"))
                .phone("0123456789")
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
        userRepository.save(adminUser);

        User staffUser = User.builder()
                .fullName("Staff User")
                .email("staff@ecommerce.com")
                .passwordHash(passwordEncoder.encode("password"))
                .phone("0987654321")
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
        userRepository.save(staffUser);
        
        User customerUser = User.builder() // Added CUSTOMER user
                .fullName("Customer User")
                .email("customer@ecommerce.com")
                .passwordHash(passwordEncoder.encode("password"))
                .phone("0111222333")
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();
        userRepository.save(customerUser);

        UserRole adminUserRole = UserRole.builder().user(adminUser).role(adminRole).build();
        UserRole staffUserRole = UserRole.builder().user(staffUser).role(staffRole).build();
        UserRole customerUserRole = UserRole.builder().user(customerUser).role(customerRole).build(); // Assign CUSTOMER role
        userRoleRepository.saveAll(List.of(adminUserRole, staffUserRole, customerUserRole));

        // ... (rest of the seeder logic)
    }
}
