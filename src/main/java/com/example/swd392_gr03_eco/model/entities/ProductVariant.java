package com.example.swd392_gr03_eco.model.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@ToString(exclude = {"product", "orderItems", "inventoryLogs"})
@EqualsAndHashCode(exclude = {"product", "orderItems", "inventoryLogs"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;

    @Column(name = "sku", unique = true)
    private String sku;

    @Column(name = "color")
    private String color;

    @Column(name = "size")
    private String size;

    @Column(name = "price_override")
    private BigDecimal priceOverride;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @OneToMany(mappedBy = "productVariant")
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();

    @OneToMany(mappedBy = "productVariant")
    @Builder.Default
    private List<InventoryLog> inventoryLogs = new ArrayList<>();
}
