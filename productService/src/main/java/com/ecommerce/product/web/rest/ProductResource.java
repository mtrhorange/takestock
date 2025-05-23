package com.ecommerce.product.web.rest;

import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.service.ProductService;
import com.ecommerce.product.service.dto.ProductDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * REST controller for managing {@link com.ecommerce.product.domain.Product}.
 */
@RestController
@RequestMapping("/api/products")
public class ProductResource {

    private static final Logger LOG = LoggerFactory.getLogger(ProductResource.class);

    private static final String ENTITY_NAME = "productServiceProduct";
    private final ProductService productService;
    private final ProductRepository productRepository;
    //    @Value("${jhipster.clientApp.name}")
    private String applicationName = "productService";

    public ProductResource(ProductService productService, ProductRepository productRepository) {
        this.productService = productService;
        this.productRepository = productRepository;
    }

    /**
     * {@code POST  /products} : Create a new product.
     *
     * @param productDTO the productDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new productDTO, or with status {@code 400 (Bad Request)} if the product has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductDTO productDTO) throws URISyntaxException {
        LOG.debug("REST request to save Product : {}", productDTO);
        if (productDTO.getId() != null) {
            throw new BadRequestException("A new product cannot already have an ID");
        }
        productDTO = productService.save(productDTO);
        return ResponseEntity.created(new URI("/api/products/" + productDTO.getId()))
                // .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, productDTO.getId()))
                .body(productDTO);
    }

    /**
     * {@code PUT  /products/:id} : Updates an existing product.
     *
     * @param id         the id of the productDTO to save.
     * @param productDTO the productDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productDTO,
     * or with status {@code 400 (Bad Request)} if the productDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the productDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable(value = "id", required = false) final String id,
            @Valid @RequestBody ProductDTO productDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Product : {}, {}", id, productDTO);
        if (productDTO.getId() == null) {
            throw new BadRequestException("Invalid id");
        }
        if (!Objects.equals(id, productDTO.getId())) {
            throw new BadRequestException("Invalid ID");
        }

        if (!productRepository.existsById(id)) {
            throw new BadRequestException("Entity not found");
        }

        productDTO = productService.update(productDTO);
        return ResponseEntity.ok()
                // .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, productDTO.getId()))
                .body(productDTO);
    }

    /**
     * {@code PATCH  /products/:id} : Partial updates given fields of an existing product, field will ignore if it is null
     *
     * @param id         the id of the productDTO to save.
     * @param productDTO the productDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated productDTO,
     * or with status {@code 400 (Bad Request)} if the productDTO is not valid,
     * or with status {@code 404 (Not Found)} if the productDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the productDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = {"application/json", "application/merge-patch+json"})
    public ResponseEntity<ProductDTO> partialUpdateProduct(
            @PathVariable(value = "id", required = false) final String id,
            @NotNull @RequestBody ProductDTO productDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Product partially : {}, {}", id, productDTO);
        if (productDTO.getId() == null) {
            throw new BadRequestException("Invalid id");
        }
        if (!Objects.equals(id, productDTO.getId())) {
            throw new BadRequestException("Invalid ID");
        }

        if (!productRepository.existsById(id)) {
            throw new BadRequestException("Entity not found");
        }

        Optional<ProductDTO> result = productService.partialUpdate(productDTO);

        return ResponseEntity.ok(result.orElseThrow());
    }

    /**
     * {@code GET  /products} : get all the products.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of products in body.
     */
    @GetMapping("")
    public ResponseEntity<List<ProductDTO>> getAllProducts(Pageable pageable) {
        LOG.debug("REST request to get a page of Products");
        Page<ProductDTO> page = productService.findAll(pageable);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok()
//                .headers(headers)
                .body(page.getContent());
    }

    @GetMapping("pageProduct")
    public ResponseEntity<Page<ProductDTO>> getAllProductsPageable(Pageable pageable) {
        LOG.debug("REST request to get a page of Products");
        Page<ProductDTO> page = productService.findAll(pageable);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok(page);
    }

    @GetMapping("search")
    public ResponseEntity<Page<ProductDTO>> getSearchProducts(
            @RequestParam(name = "search", required = false, defaultValue = "") String searchTerm,
            @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice,
            Pageable pageable
    ) {
        LOG.debug("REST request to get a page of Products");
        Page<ProductDTO> productPage = productService.searchProducts(searchTerm, minPrice, maxPrice, pageable);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok(productPage);
    }

    /**
     * {@code GET  /products/:id} : get the "id" product.
     *
     * @param id the id of the productDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the productDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable("id") String id) {
        LOG.debug("REST request to get Product : {}", id);
        Optional<ProductDTO> productDTO = productService.findOne(id);
        return ResponseEntity.ok(productDTO.orElseThrow());
    }

    /**
     * {@code DELETE  /products/:id} : delete the "id" product.
     *
     * @param id the id of the productDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable("id") String id) {
        LOG.debug("REST request to delete Product : {}", id);
        productService.delete(id);
        return ResponseEntity.noContent()
//                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id))
                .build();
    }

    @PostMapping("/placeOrder")
    public ResponseEntity<Void> placeOrder(@Valid @RequestBody List<ProductDTO> productDTO) throws URISyntaxException {
        LOG.debug("REST request to update Product qty : {}", productDTO);

        if (productDTO.isEmpty()) {
            throw new BadRequestException("product cannot be update as it is empty");
        }

        productService.reduceStock(productDTO);
        return ResponseEntity.noContent().build();
    }
}
