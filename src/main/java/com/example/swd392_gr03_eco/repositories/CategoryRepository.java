package com.example.swd392_gr03_eco.repositories;

import com.example.swd392_gr03_eco.model.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Optional<Category> findByName(String name);
    @Query(value = "WITH RECURSIVE subcategories AS (" +
            "SELECT id FROM categories WHERE id = :parentId " + // Thử đổi 'category' thành 'categories'
            "UNION ALL " +
            "SELECT c.id FROM categories c INNER JOIN subcategories s ON c.parent_id = s.id) " +
            "SELECT id FROM subcategories", nativeQuery = true)
    List<Long> findAllSubCategoryIds(@Param("parentId") Integer parentId);
}
