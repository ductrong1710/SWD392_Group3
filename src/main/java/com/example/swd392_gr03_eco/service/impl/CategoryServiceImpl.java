package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.request.CategoryRequest;
import com.example.swd392_gr03_eco.model.dto.response.CategoryResponse;
import com.example.swd392_gr03_eco.model.entities.Category;
import com.example.swd392_gr03_eco.repositories.CategoryRepository;
import com.example.swd392_gr03_eco.service.interfaces.ICategoryService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryResponse> getAllCategories() {
        // Fetch only top-level categories (those with no parent)
        List<Category> rootCategories = categoryRepository.findByParentIsNull();
        return rootCategories.stream()
                .map(this::mapToCategoryResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));
        return mapToCategoryResponse(category);
    }

    @Override
    @Transactional
    public Category createCategory(CategoryRequest request) {
        Category parent = null;
        if (request.getParentId() != null) {
            parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent category not found with id: " + request.getParentId()));
        }

        Category newCategory = Category.builder()
                .name(request.getName())
                .parent(parent)
                .build();

        return categoryRepository.save(newCategory);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Integer categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));

        Category parent = null;
        if (request.getParentId() != null) {
            // Prevent setting a category as its own parent
            if (request.getParentId().equals(categoryId)) {
                throw new IllegalArgumentException("A category cannot be its own parent.");
            }
            parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent category not found with id: " + request.getParentId()));
        }

        category.setName(request.getName());
        category.setParent(parent);

        Category updatedCategory = categoryRepository.save(category);
        return mapToCategoryResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Integer categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + categoryId));

        // Basic deletion: Fails if the category is a parent to others due to foreign key constraints.
        // For a more robust solution, you might want to re-parent children or delete them recursively.
        if (!category.getChildren().isEmpty()) {
            throw new IllegalStateException("Cannot delete a category that has children. Please re-parent or delete them first.");
        }

        categoryRepository.delete(category);
    }

    /**
     * Helper method to recursively map a Category entity to a CategoryResponse DTO.
     */
    private CategoryResponse mapToCategoryResponse(Category category) {
        if (category == null) {
            return null;
        }

        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .parentId(category.getParent() != null ? category.getParent().getId() : null)
                .parentName(category.getParent() != null ? category.getParent().getName() : null)
                .children(category.getChildren() != null ? category.getChildren().stream()
                        .map(this::mapToCategoryResponse)
                        .collect(Collectors.toList()) : null)
                .build();
    }
}
