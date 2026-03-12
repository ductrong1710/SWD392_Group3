package com.example.swd392_gr03_eco.model.dto.request;

import lombok.Data;

@Data
public class CategoryRequest {
    private String name;
    private Integer parentId; // Null if it's a top-level category
}
