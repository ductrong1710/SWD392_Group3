package com.example.swd392_gr03_eco.service.interfaces;

import com.example.swd392_gr03_eco.model.dto.request.ProductCreateRequest;
import com.example.swd392_gr03_eco.model.dto.request.ProductUpdateRequest;
import com.example.swd392_gr03_eco.model.dto.request.ProductUpdateStatusRequest;
import com.example.swd392_gr03_eco.model.dto.response.ProductDetailDto;
import com.example.swd392_gr03_eco.model.dto.response.ProductSummaryDto;
import com.example.swd392_gr03_eco.model.entities.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IProductService {
    // Public APIs
    Page<ProductSummaryDto> getAllProducts(Pageable pageable);
    Page<ProductSummaryDto> searchProducts(String keyword, Integer categoryId, String brand, Double minPrice, Double maxPrice, Pageable pageable);
    Page<ProductSummaryDto> getProductsByGender(String gender, Pageable pageable); // New method
    ProductDetailDto getProductById(Integer id);

    // Admin APIs
    List<ProductDetailDto> getAllProductsAdmin();
    Product createProduct(ProductCreateRequest request);
    void deleteProduct(Integer id);
    ProductDetailDto updateProduct(Integer id, ProductUpdateRequest request);
    ProductDetailDto updateProductStatus(Integer id, ProductUpdateStatusRequest request);
}
