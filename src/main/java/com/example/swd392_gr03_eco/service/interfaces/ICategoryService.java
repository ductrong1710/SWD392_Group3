package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.CategoryRequest;
import com.example.swd392_gr03_eco.model.dto.response.CategoryResponse;
import com.example.swd392_gr03_eco.model.entities.Category;

import java.util.List;

public interface ICategoryService {
    /**
     * Retrieves all categories in a hierarchical structure.
     * @return A list of top-level categories, each containing its children.
     */
    List<CategoryResponse> getAllCategories();

    /**
     * Retrieves a single category by its ID.
     * @param categoryId The ID of the category.
     * @return The category response DTO.
     */
    CategoryResponse getCategoryById(Integer categoryId);

    /**
     * Creates a new category.
     * @param request The request DTO containing category details.
     * @return The newly created category entity.
     */
    Category createCategory(CategoryRequest request);

    /**
     * Updates an existing category.
     * @param categoryId The ID of the category to update.
     * @param request The request DTO containing updated details.
     * @return The updated category response DTO.
     */
    CategoryResponse updateCategory(Integer categoryId, CategoryRequest request);

    /**
     * Deletes a category.
     * Note: This should handle cascading deletes or re-parenting of children if necessary.
     * @param categoryId The ID of the category to delete.
     */
    void deleteCategory(Integer categoryId);
}
