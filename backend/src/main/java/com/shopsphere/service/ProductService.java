package com.shopsphere.service;

import com.shopsphere.entity.Product;
import com.shopsphere.exception.ResourceNotFoundException;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {

    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;

    public Page<Product> getAllProducts(int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.findByActiveTrue(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public Page<Product> getProductsByCategory(Long categoryId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return productRepository.findByCategoryIdAndActiveTrue(categoryId, pageable);
    }

    public Page<Product> searchProducts(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("rating").descending());
        return productRepository.searchProducts(keyword, pageable);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue();
    }

    public List<Product> getRecommendations(Long productId) {
        Product product = getProductById(productId);
        Pageable pageable = PageRequest.of(0, 8);
        List<Product> recommendations = productRepository.findByCategoryForRecommendation(
            product.getCategory().getId(), pageable);
        recommendations.removeIf(p -> p.getId().equals(productId));
        return recommendations.size() > 4 ? recommendations.subList(0, 4) : recommendations;
    }

    public Product createProduct(Product product) {
        if (product.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(product.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found")));
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setDiscountPrice(productDetails.getDiscountPrice());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setImageUrl(productDetails.getImageUrl());
        product.setBrand(productDetails.getBrand());
        product.setActive(productDetails.isActive());
        product.setFeatured(productDetails.isFeatured());
        if (productDetails.getCategoryId() != null) {
            product.setCategory(categoryRepository.findById(productDetails.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found")));
        }
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setActive(false);
        productRepository.save(product);
    }
}
