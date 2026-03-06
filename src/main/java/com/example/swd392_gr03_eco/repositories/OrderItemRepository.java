package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.dto.response.ProductPerformanceResponse;
import com.example.swd392_gr03_eco.model.entities.Order;
import com.example.swd392_gr03_eco.model.entities.OrderItem;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    List<OrderItem> findByOrder(Order order);

    @Query("SELECT new com.example.swd392_gr03_eco.model.dto.response.ProductPerformanceResponse(oi.productVariant.product.id, oi.productVariant.product.name, SUM(oi.quantity)) " +
           "FROM OrderItem oi WHERE UPPER(TRIM(oi.order.status)) = 'COMPLETED' AND oi.order.createdAt >= :startDate AND oi.order.createdAt < :endDate " +
           "GROUP BY oi.productVariant.product.id, oi.productVariant.product.name " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<ProductPerformanceResponse> findProductPerformance(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate, Pageable pageable);
}
