package com.example.swd392_gr03_eco.model.entities;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_sessions")
@Getter
@Setter
@ToString(exclude = {"user", "messages"})
@EqualsAndHashCode(exclude = {"user", "messages"})
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "started_at")
    private Timestamp startedAt;

    @Column(name = "context_summary", columnDefinition = "TEXT")
    private String contextSummary;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    @Builder.Default
    private List<ChatMessage> messages = new ArrayList<>();
}
