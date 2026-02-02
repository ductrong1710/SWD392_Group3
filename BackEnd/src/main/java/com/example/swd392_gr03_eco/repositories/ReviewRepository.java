package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.entities.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByOrderItemId(Integer orderItemId);
    boolean existsByOrderItemId(Integer orderItemId);
}
