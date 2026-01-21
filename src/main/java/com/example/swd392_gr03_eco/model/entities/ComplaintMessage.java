package com.example.swd392_gr03_eco.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "complaint_messages")
@Getter
@Setter
@ToString(exclude = {"complaint", "user"})
@EqualsAndHashCode(exclude = {"complaint", "user"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplaintMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "complaint_id")
    private Complaint complaint;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user; // The user who sent the message (customer or staff)

    @Column(columnDefinition = "TEXT")
    private String message;

    private Timestamp createdAt;
}
