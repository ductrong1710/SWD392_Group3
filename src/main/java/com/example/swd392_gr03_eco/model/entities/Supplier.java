package com.example.swd392_gr03_eco.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "suppliers")
@Getter
@Setter
@ToString(exclude = "inventoryLogs")
@EqualsAndHashCode(exclude = "inventoryLogs")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "contact_info", columnDefinition = "TEXT")
    private String contactInfo;

    @OneToMany(mappedBy = "supplier")
    @Builder.Default
    private List<InventoryLog> inventoryLogs = new ArrayList<>();
}
