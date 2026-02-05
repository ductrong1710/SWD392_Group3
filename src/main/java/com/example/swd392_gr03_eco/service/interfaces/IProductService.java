package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.ProductCreateRequest;
import com.example.swd392_gr03_eco.model.dto.response.ProductSummaryDto;
import com.example.swd392_gr03_eco.model.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IProductService {
    Page<ProductSummaryDto> getAllProducts(Pageable pageable);
    Page<ProductSummaryDto> searchProducts(String keyword, Integer categoryId, String brand, Double minPrice, Double maxPrice, Pageable pageable);
    Product getProductById(Integer id);
    Product createProduct(ProductCreateRequest request);
    Product updateProduct(Integer id, ProductCreateRequest request);
    void deleteProduct(Integer id);
}
