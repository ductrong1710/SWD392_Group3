package com.example.swd392_gr03_eco.model.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_addresses")
@Getter
@Setter
@ToString(exclude = "user")
@EqualsAndHashCode(exclude = "user")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "address_line")
    private String addressLine;

    @Column(name = "city")
    private String city;

    @Column(name = "is_default")
    private Boolean isDefault;
}
