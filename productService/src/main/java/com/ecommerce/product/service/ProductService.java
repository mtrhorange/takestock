package com.ecommerce.product.service;

import com.ecommerce.product.domain.Product;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.service.dto.ProductDTO;
import com.ecommerce.product.service.mapper.ProductMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Service Implementation for managing {@link com.ecommerce.product.domain.Product}.
 */
@Service
public class ProductService {

    private static final Logger LOG = LoggerFactory.getLogger(ProductService.class);

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    private final MongoTemplate mongoTemplate;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper, MongoTemplate mongoTemplate) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
        this.mongoTemplate = mongoTemplate;
    }

    /**
     * Save a product.
     *
     * @param productDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductDTO save(ProductDTO productDTO) {
        LOG.debug("Request to save Product : {}", productDTO);
        Product product = productMapper.toEntity(productDTO);
        product = productRepository.save(product);
        return productMapper.toDto(product);
    }

    /**
     * Update a product.
     *
     * @param productDTO the entity to save.
     * @return the persisted entity.
     */
    public ProductDTO update(ProductDTO productDTO) {
        LOG.debug("Request to update Product : {}", productDTO);
        Product product = productMapper.toEntity(productDTO);
        product = productRepository.save(product);
        return productMapper.toDto(product);
    }

    /**
     * Partially update a product.
     *
     * @param productDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ProductDTO> partialUpdate(ProductDTO productDTO) {
        LOG.debug("Request to partially update Product : {}", productDTO);

        return productRepository
                .findById(productDTO.getId())
                .map(existingProduct -> {
                    productMapper.partialUpdate(existingProduct, productDTO);

                    return existingProduct;
                })
                .map(productRepository::save)
                .map(productMapper::toDto);
    }

    /**
     * Get all the products.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    public Page<ProductDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Products");
        return productRepository.findAll(pageable).map(productMapper::toDto);
    }

    /**
     * Get one product by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<ProductDTO> findOne(String id) {
        LOG.debug("Request to get Product : {}", id);
        return productRepository.findById(id).map(productMapper::toDto);
    }

    /**
     * Delete the product by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        LOG.debug("Request to delete Product : {}", id);
        productRepository.deleteById(id);
    }

    public void reduceStock(List<ProductDTO> productDTOs) {
        LOG.debug("Request to update Product stock : {}", productDTOs);

        for (ProductDTO productDTO : productDTOs) {
            Product product = productRepository.findById(productDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + productDTO.getProductId()));

            if (product.getStock() < productDTO.getQty()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getId());
            }

            // Deduct stock
            product.setStock(product.getStock() - productDTO.getQty());
            productRepository.save(product);
        }
    }

    public Page<ProductDTO> searchProducts(String name, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Query query = new Query().with(pageable);

        if (name != null && !name.isEmpty()) {
            query.addCriteria(Criteria.where("name").regex(name, "i"));
        }

        if (minPrice != null && maxPrice != null) {
            query.addCriteria(Criteria.where("price").gte(minPrice).lte(maxPrice));
        } else if (minPrice != null) {
            query.addCriteria(Criteria.where("price").gte(minPrice));
        } else if (maxPrice != null) {
            query.addCriteria(Criteria.where("price").lte(maxPrice));
        }

        List<Product> products = mongoTemplate.find(query, Product.class);
        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Product.class);

        List<ProductDTO> dtos = products.stream().map(productMapper::toDto).toList();
        return new PageImpl<>(dtos, pageable, total);
    }
}
