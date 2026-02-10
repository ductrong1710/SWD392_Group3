package com.example.swd392_gr03_eco.model.entities;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnTransformer;

import java.math.BigDecimal;
import java.time.Instant;
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
    @JoinColumn(name = "category_id", nullable = false)
    @JsonManagedReference("product-category")
    private Category category;

    @Column(name = "brand_name")
    private String brandName;

    @Column(name = "base_price")
    private BigDecimal basePrice;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "vector_embedding", columnDefinition = "vector(384)")
    @ColumnTransformer(write = "CAST(? AS vector)")
    private String vectorEmbedding;

    @Column(name = "created_at")
    private Instant createdAt;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @Builder.Default
    @JsonManagedReference("product-variants")
    private List<ProductVariant> productVariants = new ArrayList<>();

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    @Builder.Default
    @JsonManagedReference("product-images")
    private List<ProductImage> productImages = new ArrayList<>();
}
