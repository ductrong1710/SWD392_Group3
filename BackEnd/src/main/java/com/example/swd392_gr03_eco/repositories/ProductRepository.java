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

    /**
     * Finds the top N nearest neighbors to a given vector using cosine distance.
     * The '<->' operator in pgvector calculates the cosine distance (1 - cosine similarity).
     * A smaller distance means a better match.
     * The query casts the input string to a vector.
     *
     * @param embedding The vector to compare against, as a String in the format "[1.0,2.0,...]".
     * @param limit The maximum number of neighbors to return.
     * @return A list of the nearest products.
     */
    @Query(value = "SELECT * FROM products ORDER BY vector_embedding <-> CAST(:embedding AS vector) LIMIT :limit", nativeQuery = true)
    List<Product> findNearestNeighbors(@Param("embedding") String embedding, @Param("limit") int limit);
}
