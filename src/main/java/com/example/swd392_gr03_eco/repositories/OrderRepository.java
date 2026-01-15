package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(Integer userId);
    Optional<Order> findByIdAndUserId(Integer orderId, Integer userId);

    @Query("SELECT CASE WHEN COUNT(o) > 0 THEN TRUE ELSE FALSE END " +
           "FROM Order o JOIN o.orderItems oi JOIN oi.productVariant pv " +
           "WHERE o.user.id = :userId AND pv.product.id = :productId AND o.status = :status")
    boolean existsByUserIdAndProductIdAndStatus(@Param("userId") Integer userId, @Param("productId") Integer productId, @Param("status") String status);
}
