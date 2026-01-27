package com.example.swd392_gr03_eco.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "payments")
@Getter
@Setter
@ToString(exclude = {"order", "user"})
@EqualsAndHashCode(exclude = {"order", "user"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "method")
    private String method;

    @Column(name = "status")
    private String status;

    @Column(name = "transaction_code")
    private String transactionCode;

    @Column(name = "raw_response_log", columnDefinition = "TEXT")
    private String rawResponseLog;

    @Column(name = "paid_at")
    private Timestamp paidAt;
}
