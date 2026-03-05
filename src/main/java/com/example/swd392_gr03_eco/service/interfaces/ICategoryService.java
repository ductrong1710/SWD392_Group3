package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.response.CategoryNodeDto;
import java.util.List;

public interface ICategoryService {
    List<CategoryNodeDto> getCategoryTree();
}
