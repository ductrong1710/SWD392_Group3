package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.ProductCreateRequest;
import com.example.swd392_gr03_eco.model.dto.response.ProductDetailDto;
import com.example.swd392_gr03_eco.model.dto.response.ProductSummaryDto;
import com.example.swd392_gr03_eco.model.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IProductService {
    // For public-facing API (paginated, summary)
    Page<ProductSummaryDto> getAllProducts(Pageable pageable);
    Page<ProductSummaryDto> searchProducts(String keyword, Integer categoryId, String brand, Double minPrice, Double maxPrice, Pageable pageable);

    // For admin-facing API (full details)
    List<ProductDetailDto> getAllProductsAdmin();
    ProductDetailDto getProductById(Integer id);

    // For product management
    Product createProduct(ProductCreateRequest request);
    Product updateProduct(Integer id, ProductCreateRequest request);
    void deleteProduct(Integer id);
}
