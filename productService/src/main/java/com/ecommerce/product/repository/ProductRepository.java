package com.ecommerce.product.repository;

import com.ecommerce.product.domain.Product;
import com.ecommerce.product.service.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Product entity.
 */
@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    @Query("{ 'name': { $regex: ?0, $options: 'i' } }")
    Page<ProductDTO> findByNameLike(String name, Pageable pageable);
}
