package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.entities.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
    List<ChatMessage> findBySessionIdOrderByCreatedAtAsc(Integer sessionId);
}
