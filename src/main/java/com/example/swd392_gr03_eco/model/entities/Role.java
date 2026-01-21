package com.example.swd392_gr03_eco.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
@Getter
@Setter
@ToString(exclude = "userRoles")
@EqualsAndHashCode(exclude = "userRoles")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "role_name")
    private String roleName; // Admin, Customer, Staff

    @OneToMany(mappedBy = "role")
    @Builder.Default
    private Set<UserRole> userRoles = new HashSet<>();
}
