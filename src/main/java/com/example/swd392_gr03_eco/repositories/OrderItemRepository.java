package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.dto.response.TopSellingProductDto;
import com.example.swd392_gr03_eco.model.entities.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    @Query("SELECT new com.example.swd392_gr03_eco.model.dto.response.TopSellingProductDto(oi.productVariant.product.id, oi.productVariant.product.name, SUM(oi.quantity)) " +
           "FROM OrderItem oi WHERE oi.order.status = 'COMPLETED' " +
           "GROUP BY oi.productVariant.product.id, oi.productVariant.product.name " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<TopSellingProductDto> findTopSellingProducts();
}
