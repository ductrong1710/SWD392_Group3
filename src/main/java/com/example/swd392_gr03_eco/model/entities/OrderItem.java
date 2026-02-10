package com.example.swd392_gr03_eco.model.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@ToString(exclude = {"order", "productVariant"})
@EqualsAndHashCode(exclude = {"order", "productVariant"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    @JsonBackReference("order-items")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_variant_id")
    @JsonManagedReference("variant-orderitems")
    private ProductVariant productVariant;

    @Column(name = "quantity")
    private Integer quantity;

    @Column(name = "price_at_purchase")
    private BigDecimal priceAtPurchase;

    @OneToMany(mappedBy = "orderItem", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Review> reviews;
}
