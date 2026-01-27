package com.example.swd392_gr03_eco.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter
@Setter
@ToString(exclude = {"productVariants", "productImages"})
@EqualsAndHashCode(exclude = {"productVariants", "productImages"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(name = "brand_name")
    private String brandName;

    @Column(name = "base_price")
    private BigDecimal basePrice;

    @Column(name = "is_active")
    private Boolean isActive;

    @Lob
    @Column(name = "vector_embedding", columnDefinition = "TEXT")
    private String vectorEmbedding;

    @Column(name = "created_at")
    private Timestamp createdAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @Builder.Default // Ensure builder initializes the collection
    private List<ProductVariant> productVariants = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @Builder.Default // Ensure builder initializes the collection
    private List<ProductImage> productImages = new ArrayList<>();
}
