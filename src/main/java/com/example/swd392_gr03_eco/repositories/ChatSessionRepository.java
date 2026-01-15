package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.entities.ChatSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatSessionRepository extends JpaRepository<ChatSession, Integer> {
}
