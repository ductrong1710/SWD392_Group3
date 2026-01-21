package com.example.swd392_gr03_eco.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@ToString(exclude = {"user", "orderItems", "payments"})
@EqualsAndHashCode(exclude = {"user", "orderItems", "payments"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Column(name = "discount_amount")
    private BigDecimal discountAmount;

    @Column(name = "final_amount")
    private BigDecimal finalAmount;

    @Column(name = "status")
    private String status;

    @Column(name = "shipping_address_json", columnDefinition = "TEXT")
    private String shippingAddressJson;
    
    @Column(name = "shipping_provider")
    private String shippingProvider;

    @Column(name = "tracking_code")
    private String trackingCode;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Payment> payments = new ArrayList<>();
}
