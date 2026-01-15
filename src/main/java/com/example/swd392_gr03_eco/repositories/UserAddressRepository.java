package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.entities.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Integer> {
}
