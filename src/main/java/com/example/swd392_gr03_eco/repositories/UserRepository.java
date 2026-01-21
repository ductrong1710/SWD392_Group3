package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

    // --- Dashboard Queries ---
    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :since")
    Long countNewUsersSince(Instant since);
}
