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

    List<Order> findByTrackingAndUpdateAtBefore(String tracking, Instant time);

    // Interface for projection
    interface SalesDataPointProjection {
        String getTimeLabel();
        BigDecimal getRevenue();
    }

    @Query(value = "SELECT TO_CHAR(o.created_at, :dateFormat) AS timeLabel, SUM(o.final_amount) AS revenue " +
                   "FROM orders o WHERE UPPER(TRIM(o.status)) = 'COMPLETED' AND o.created_at >= :startDate AND o.created_at < :endDate " +
                   "GROUP BY timeLabel ORDER BY timeLabel ASC", nativeQuery = true)
    List<SalesDataPointProjection> findSalesDataByPeriodNative(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate, @Param("dateFormat") String dateFormat);

    @Query("SELECT COALESCE(SUM(o.finalAmount), 0) FROM Order o WHERE UPPER(TRIM(o.status)) = 'COMPLETED' AND o.createdAt >= :startDate AND o.createdAt < :endDate")
    BigDecimal findTotalRevenueBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);


    // --- Dashboard Queries ---
    @Query("SELECT COALESCE(SUM(o.finalAmount), 0) FROM Order o WHERE UPPER(TRIM(o.status)) = 'COMPLETED'")
    BigDecimal findTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt >= :since")
    Long countNewOrdersSince(@Param("since") Instant since);

    @Query("SELECT new com.example.swd392_gr03_eco.model.dto.response.RevenueOverTimeDto(CAST(o.createdAt AS java.time.LocalDate), SUM(o.finalAmount)) " +
           "FROM Order o WHERE UPPER(TRIM(o.status)) = 'COMPLETED' AND o.createdAt >= :since " +
           "GROUP BY CAST(o.createdAt AS java.time.LocalDate) ORDER BY CAST(o.createdAt AS java.time.LocalDate)")
    List<RevenueOverTimeDto> findRevenueOverTime(@Param("since") Instant since);
}
