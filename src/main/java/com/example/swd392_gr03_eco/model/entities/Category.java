package com.example.swd392_gr03_eco.model.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@ToString(exclude = {"parent", "children", "products"})
@EqualsAndHashCode(exclude = {"parent", "children", "products"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    @JsonBackReference("category-parent")
    private Category parent;

    @OneToMany(mappedBy = "parent")
    @Builder.Default
    @JsonManagedReference("category-parent")
    private List<Category> children = new ArrayList<>();

    @Column(name = "ai_tag_metadata", columnDefinition = "TEXT")
    private String aiTagMetadata;

    @OneToMany(mappedBy = "category")
    @JsonBackReference("product-category")
    private List<Product> products = new ArrayList<>();
}
