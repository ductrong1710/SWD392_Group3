package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.entities.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Integer> {
    List<Complaint> findByUserId(Integer userId);
}
