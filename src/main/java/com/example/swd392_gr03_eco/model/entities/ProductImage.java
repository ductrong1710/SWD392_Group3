package com.example.swd392_gr03_eco.model.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@ToString(exclude = "product")
@EqualsAndHashCode(exclude = "product")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    @JsonBackReference("product-images")
    private Product product;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "is_thumbnail")
    private Boolean isThumbnail;
}
