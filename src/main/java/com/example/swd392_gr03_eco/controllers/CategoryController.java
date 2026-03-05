package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.response.CategoryNodeDto;
import com.example.swd392_gr03_eco.service.interfaces.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final ICategoryService categoryService;

    @GetMapping
    public ResponseEntity<List<CategoryNodeDto>> getCategoryTree() {
        return ResponseEntity.ok(categoryService.getCategoryTree());
    }
}
