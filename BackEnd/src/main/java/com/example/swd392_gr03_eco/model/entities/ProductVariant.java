package com.example.swd392_gr03_eco.model.entities; // Đảm bảo package này thuộc phạm vi quét của PrimaryDbConfig

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
@ToString(exclude = {"product", "orderItems"})
@EqualsAndHashCode(exclude = {"product", "orderItems"})
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
    private String color; // Ví dụ: "Xanh Navy", "Đỏ Đô"

    @Column(name = "size")
    private String size;  // Ví dụ: "XL", "42"

    // --- THÊM TRƯỜNG NÀY THEO YÊU CẦU ---
    @Column(name = "material")
    private String material; // Ví dụ: "Cotton", "Lụa", "Jean"
    // ------------------------------------

    @Column(name = "price_override")
    private BigDecimal priceOverride;

    @Column(name = "stock_quantity")
    private Integer stockQuantity;

    @OneToMany(mappedBy = "productVariant")
    @Builder.Default
    private List<OrderItem> orderItems = new ArrayList<>();
}