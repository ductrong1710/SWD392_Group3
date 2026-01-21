package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.entities.ComplaintMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplaintMessageRepository extends JpaRepository<ComplaintMessage, Integer> {
}
