package com.example.swd392_gr03_eco.model.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class CategoryNodeDto {
    private Integer id;
    private String name;
    private List<CategoryNodeDto> children;
}
