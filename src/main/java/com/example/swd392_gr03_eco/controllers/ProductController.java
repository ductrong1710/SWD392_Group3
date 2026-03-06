package com.example.swd392_gr03_eco.controllers;

import com.example.swd392_gr03_eco.model.dto.request.ProductCreateRequest;
import com.example.swd392_gr03_eco.model.dto.request.ProductUpdateRequest;
import com.example.swd392_gr03_eco.model.dto.request.ProductUpdateStatusRequest;
import com.example.swd392_gr03_eco.model.dto.response.ProductDetailDto;
import com.example.swd392_gr03_eco.model.dto.response.ProductSummaryDto;
import com.example.swd392_gr03_eco.model.entities.Product;
import com.example.swd392_gr03_eco.service.interfaces.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final IProductService productService;

    // --- Public APIs ---

    @GetMapping
    public ResponseEntity<Page<ProductSummaryDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {

        String sortField = sort[0];
        String sortDirection = sort[1];
        
        Sort.Direction direction = sortDirection.equals("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort.Order order = new Sort.Order(direction, sortField);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(order));
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductSummaryDto>> searchProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort) {

        String sortField = sort[0];
        String sortDirection = sort[1];

        Sort.Direction direction = sortDirection.equals("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort.Order order = new Sort.Order(direction, sortField);

        Pageable pageable = PageRequest.of(page, size, Sort.by(order));
        return ResponseEntity.ok(productService.searchProducts(keyword, categoryId, brand, minPrice, maxPrice, pageable));
    }

    @GetMapping("/gender/{gender}")
    public ResponseEntity<Page<ProductSummaryDto>> getProductsByGender(
            @PathVariable String gender,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {
        
        String sortField = sort[0];
        String sortDirection = sort[1];
        
        Sort.Direction direction = sortDirection.equals("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Sort.Order order = new Sort.Order(direction, sortField);
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(order));
        return ResponseEntity.ok(productService.getProductsByGender(gender, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDto> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/{name}")
    public ResponseEntity<ProductDetailDto> getProductByName(@PathVariable String name) {
        return ResponseEntity.ok(productService.getProductByName(name));
    }

    // --- Admin/Staff APIs ---

    @GetMapping("/all")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<List<ProductDetailDto>> getAllProductsAdmin() {
        return ResponseEntity.ok(productService.getAllProductsAdmin());
    }

    @GetMapping("/all/active")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<List<ProductDetailDto>> getAllProductsActive() {
        return ResponseEntity.ok(productService.getAllProductsActive());
    }
    @GetMapping("/all/inactive")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<List<ProductDetailDto>> getAllProductsInActive() {
        return ResponseEntity.ok(productService.getAllProductsInActive());
    }


    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<Product> createProduct(@RequestBody ProductCreateRequest request) {
        Product createdProduct = productService.createProduct(request);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ProductDetailDto> updateProduct(@PathVariable Integer id, @RequestBody ProductUpdateRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<ProductDetailDto> updateProductStatus(@PathVariable Integer id, @RequestBody ProductUpdateStatusRequest request) {
        return ResponseEntity.ok(productService.updateProductStatus(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'STAFF')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
