package com.example.swd392_gr03_eco.service.impl;

import com.example.swd392_gr03_eco.model.dto.response.CategoryNodeDto;
import com.example.swd392_gr03_eco.model.entities.Category;
import com.example.swd392_gr03_eco.repositories.CategoryRepository;
import com.example.swd392_gr03_eco.service.interfaces.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CategoryServiceImpl implements ICategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<CategoryNodeDto> getCategoryTree() {
        List<Category> allCategories = categoryRepository.findAll();
        return allCategories.stream()
                .filter(category -> category.getParent() == null) // Start with root categories
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CategoryNodeDto mapToDto(Category category) {
        CategoryNodeDto dto = new CategoryNodeDto();
        dto.setId(category.getId());
        dto.setName(category.getName());
        if (category.getChildren() != null && !category.getChildren().isEmpty()) {
            dto.setChildren(category.getChildren().stream()
                    .map(this::mapToDto)
                    .collect(Collectors.toList()));
        }
        return dto;
    }
}
