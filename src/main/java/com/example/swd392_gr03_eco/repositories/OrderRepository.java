package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.dto.response.RevenueOverTimeDto;
import com.example.swd392_gr03_eco.model.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    List<Order> findByUserId(Integer userId);
    Optional<Order> findByIdAndUserId(Integer orderId, Integer userId);
    Optional<Order> findByUserIdAndStatus(Integer userId, String status);

    // --- Dashboard Queries ---
    @Query("SELECT COALESCE(SUM(o.finalAmount), 0) FROM Order o WHERE o.status = 'COMPLETED'")
    BigDecimal findTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :since")
    Long countNewOrdersSince(@Param("since") Instant since);

    @Query("SELECT new com.example.swd392_gr03_eco.model.dto.response.RevenueOverTimeDto(CAST(o.createdAt AS java.time.LocalDate), SUM(o.finalAmount)) " +
           "FROM Order o WHERE o.status = 'COMPLETED' AND o.createdAt >= :since " +
           "GROUP BY CAST(o.createdAt AS java.time.LocalDate) ORDER BY CAST(o.createdAt AS java.time.LocalDate)")
    List<RevenueOverTimeDto> findRevenueOverTime(@Param("since") Instant since);
}
