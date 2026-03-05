package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {

    // Method to find a product by its exact name
    Optional<Product> findByName(String name);

    @Query(value = "SELECT * FROM products WHERE is_active = true ORDER BY vector_embedding <-> CAST(:embedding AS vector) LIMIT :limit", nativeQuery = true)
    List<Product> findNearestNeighbors(@Param("embedding") String embedding, @Param("limit") int limit);

    @Query("SELECT p FROM Product p WHERE p.category.parent.id = :parentCategoryId AND p.isActive = true")
    Page<Product> findByParentCategoryId(@Param("parentCategoryId") Integer parentCategoryId, Pageable pageable);

    Page<Product> findByCategoryIdIn(List<Long> categoryIds, Pageable pageable);

    Page<Product> findByCategoryIdInAndIsActive(List<Long> categoryIds, boolean isActive, Pageable pageable);

    List<Product> findAllByIsActive(boolean isActive);

    Page<Product> findAllByIsActive(boolean isActive, Pageable pageable);
}
