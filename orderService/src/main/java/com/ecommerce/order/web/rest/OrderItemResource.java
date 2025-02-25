package com.ecommerce.order.web.rest;

import com.ecommerce.order.repository.OrderItemRepository;
import com.ecommerce.order.service.OrderItemService;
import com.ecommerce.order.service.dto.OrderItemDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * REST controller for managing {@link com.ecommerce.order.domain.OrderItem}.
 */
@RestController
@RequestMapping("/api/order-items")
public class OrderItemResource {

    private static final Logger LOG = LoggerFactory.getLogger(OrderItemResource.class);

    private static final String ENTITY_NAME = "orderServiceOrderItem";

    // @Value("${jhipster.clientApp.name}")
    private String applicationName = "app";

    private final OrderItemService orderItemService;

    private final OrderItemRepository orderItemRepository;

    public OrderItemResource(OrderItemService orderItemService, OrderItemRepository orderItemRepository) {
        this.orderItemService = orderItemService;
        this.orderItemRepository = orderItemRepository;
    }

    /**
     * {@code POST  /order-items} : Create a new orderItem.
     *
     * @param orderItemDTO the orderItemDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderItemDTO, or with status {@code 400 (Bad Request)} if the orderItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<OrderItemDTO> createOrderItem(@Valid @RequestBody OrderItemDTO orderItemDTO) throws URISyntaxException {
        LOG.debug("REST request to save OrderItem : {}", orderItemDTO);
        if (orderItemDTO.getId() != null) {
            throw new BadRequestException("A new orderItem cannot already have an ID");
        }
        orderItemDTO = orderItemService.save(orderItemDTO);
        return ResponseEntity.created(new URI("/api/order-items/" + orderItemDTO.getId()))
//            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, orderItemDTO.getId().toString()))
            .body(orderItemDTO);
    }

    /**
     * {@code PUT  /order-items/:id} : Updates an existing orderItem.
     *
     * @param id the id of the orderItemDTO to save.
     * @param orderItemDTO the orderItemDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderItemDTO,
     * or with status {@code 400 (Bad Request)} if the orderItemDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderItemDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrderItemDTO> updateOrderItem(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody OrderItemDTO orderItemDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update OrderItem : {}, {}", id, orderItemDTO);
        if (orderItemDTO.getId() == null) {
            throw new BadRequestException("Invalid id");
        }
        if (!Objects.equals(id, orderItemDTO.getId())) {
            throw new BadRequestException("Invalid ID");
        }

        if (!orderItemRepository.existsById(id)) {
            throw new BadRequestException("Entity not found");
        }

        orderItemDTO = orderItemService.update(orderItemDTO);
        return ResponseEntity.ok()
//            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderItemDTO.getId().toString()))
            .body(orderItemDTO);
    }

    /**
     * {@code PATCH  /order-items/:id} : Partial updates given fields of an existing orderItem, field will ignore if it is null
     *
     * @param id the id of the orderItemDTO to save.
     * @param orderItemDTO the orderItemDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderItemDTO,
     * or with status {@code 400 (Bad Request)} if the orderItemDTO is not valid,
     * or with status {@code 404 (Not Found)} if the orderItemDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderItemDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<OrderItemDTO> partialUpdateOrderItem(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody OrderItemDTO orderItemDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update OrderItem partially : {}, {}", id, orderItemDTO);
        if (orderItemDTO.getId() == null) {
            throw new BadRequestException("Invalid id");
        }
        if (!Objects.equals(id, orderItemDTO.getId())) {
            throw new BadRequestException("Invalid ID");
        }

        if (!orderItemRepository.existsById(id)) {
            throw new BadRequestException("Entity not found");
        }

//        Optional<OrderItemDTO> result = orderItemService.partialUpdate(orderItemDTO);
        return null;
//        return ResponseUtil.wrapOrNotFound(
//            result,
//            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderItemDTO.getId().toString())
//        );
    }

    /**
     * {@code GET  /order-items} : get all the orderItems.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orderItems in body.
     */
    @GetMapping("")
    public ResponseEntity<List<OrderItemDTO>> getAllOrderItems(Pageable pageable) {
        LOG.debug("REST request to get a page of OrderItems");
        Page<OrderItemDTO> page = orderItemService.findAll(pageable);
//        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok(page.getContent());
    }

    /**
     * {@code GET  /order-items/:id} : get the "id" orderItem.
     *
     * @param id the id of the orderItemDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderItemDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderItemDTO> getOrderItem(@PathVariable("id") Long id) {
        LOG.debug("REST request to get OrderItem : {}", id);
        Optional<OrderItemDTO> orderItemDTO = orderItemService.findOne(id);
        return ResponseEntity.ok(orderItemDTO.orElseThrow());
    }

    /**
     * {@code DELETE  /order-items/:id} : delete the "id" orderItem.
     *
     * @param id the id of the orderItemDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderItem(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete OrderItem : {}", id);
        orderItemService.delete(id);
        return ResponseEntity.ok().build();
    }
}
