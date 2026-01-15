package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {
    List<Product> findByIsActiveTrue();

    @Query(value = "SELECT * FROM products ORDER BY H2VECTOR_COSINE(vector_embedding, :query_embedding) LIMIT :limit", nativeQuery = true)
    List<Product> findNearestNeighbors(@Param("query_embedding") float[] queryEmbedding, @Param("limit") int limit);
}
