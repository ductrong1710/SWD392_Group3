package com.example.swd392_gr03_eco.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "chat_messages")
@Getter
@Setter
@ToString(exclude = "session")
@EqualsAndHashCode(exclude = "session")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private ChatSession session;

    private String sender; // USER or BOT

    @Column(columnDefinition = "TEXT")
    private String messageText;

    private Timestamp createdAt;
}
