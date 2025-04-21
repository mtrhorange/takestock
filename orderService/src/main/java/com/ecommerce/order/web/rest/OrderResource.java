package com.ecommerce.order.web.rest;

import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.service.OrderService;
import com.ecommerce.order.service.dto.OrderCancelOrRefundDTO;
import com.ecommerce.order.service.dto.OrderDTO;
import com.ecommerce.order.service.dto.OrderPlaceDTO;
import com.ecommerce.order.service.dto.ViewOrdersDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * REST controller for managing {@link com.ecommerce.order.domain.Order}.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderResource {

    private static final Logger LOG = LoggerFactory.getLogger(OrderResource.class);

    private static final String ENTITY_NAME = "orderServiceOrder";
    private final OrderService orderService;
    private final OrderRepository orderRepository;
    private String applicationName = "app";

    public OrderResource(OrderService orderService, OrderRepository orderRepository) {
        this.orderService = orderService;
        this.orderRepository = orderRepository;
    }

    /**
     * {@code POST  /orders} : Create a new order.
     *
     * @param orderDTO the orderDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new orderDTO, or with status {@code 400 (Bad Request)} if the order has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderDTO orderDTO) throws URISyntaxException {
        LOG.debug("REST request to save Order : {}", orderDTO);
        if (orderDTO.getId() != null) {
            throw new BadRequestException("A new order cannot already have an ID");
        }
        orderDTO = orderService.save(orderDTO);
        return ResponseEntity.created(new URI("/api/orders/" + orderDTO.getId()))
                // .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, orderDTO.getId().toString()))
                .body(orderDTO);
    }

    /**
     * {@code PUT  /orders/:id} : Updates an existing order.
     *
     * @param id       the id of the orderDTO to save.
     * @param orderDTO the orderDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderDTO,
     * or with status {@code 400 (Bad Request)} if the orderDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the orderDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(
            @PathVariable(value = "id", required = false) final Long id,
            @Valid @RequestBody OrderDTO orderDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Order : {}, {}", id, orderDTO);
        if (orderDTO.getId() == null) {
            throw new BadRequestException("Invalid id");
        }
        if (!Objects.equals(id, orderDTO.getId())) {
            throw new BadRequestException("Invalid ID");
        }

        if (!orderRepository.existsById(id)) {
            throw new BadRequestException("Entity not found");
        }

        orderDTO = orderService.update(orderDTO);
        return ResponseEntity.ok()
                // .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderDTO.getId().toString()))
                .body(orderDTO);
    }

    /**
     * {@code PATCH  /orders/:id} : Partial updates given fields of an existing order, field will ignore if it is null
     *
     * @param id       the id of the orderDTO to save.
     * @param orderDTO the orderDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated orderDTO,
     * or with status {@code 400 (Bad Request)} if the orderDTO is not valid,
     * or with status {@code 404 (Not Found)} if the orderDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the orderDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = {"application/json", "application/merge-patch+json"})
    public ResponseEntity<OrderDTO> partialUpdateOrder(
            @PathVariable(value = "id", required = false) final Long id,
            @NotNull @RequestBody OrderDTO orderDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Order partially : {}, {}", id, orderDTO);
        if (orderDTO.getId() == null) {
            throw new BadRequestException("Invalid id");
        }
        if (!Objects.equals(id, orderDTO.getId())) {
            throw new BadRequestException("Invalid ID");
        }

        if (!orderRepository.existsById(id)) {
            throw new BadRequestException("Entity not found");
        }

        Optional<OrderDTO> result = orderService.partialUpdate(orderDTO);
        return ResponseEntity.ok(result.orElseThrow());
        // return ResponseUtil.wrapOrNotFound(
        //     result,
        //     HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, orderDTO.getId().toString())
        // );
    }

    /**
     * {@code GET  /orders} : get all the orders.
     *
     * @param pageable the pagination information.
     * @param filter   the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of orders in body.
     */
    @GetMapping("")
    public ResponseEntity<List<OrderDTO>> getAllOrders(Pageable pageable,
                                                       @RequestParam(name = "filter", required = false) String filter
    ) {
        if ("payment-is-null".equals(filter)) {
            LOG.debug("REST request to get all Orders where payment is null");
            return new ResponseEntity<>(orderService.findAllWherePaymentIsNull(), HttpStatus.OK);
        }
        LOG.debug("REST request to get a page of Orders");
        Page<OrderDTO> page = orderService.findAll(pageable);
        // HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().body(page.getContent());
    }

    /**
     * {@code GET  /orders/:id} : get the "id" order.
     *
     * @param id the id of the orderDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the orderDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrder(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Order : {}", id);
        Optional<OrderDTO> orderDTO = orderService.findOne(id);
        return ResponseEntity.ok(orderDTO.orElseThrow());
    }

    /**
     * {@code DELETE  /orders/:id} : delete the "id" order.
     *
     * @param id the id of the orderDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Order : {}", id);
        orderService.delete(id);
        return ResponseEntity.noContent()
                // .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
    }

    @PostMapping("/placeOrder")
    public ResponseEntity<OrderDTO> placeOrder(@Valid @RequestBody OrderPlaceDTO orderPlaceDTO) throws URISyntaxException {
        LOG.debug("REST request to save Order : {}", orderPlaceDTO);
        if (orderPlaceDTO.getUserId1() == null) {
            throw new BadRequestException("A new order cannot be created as there is no userId");
        }
        OrderDTO orderDTO = orderService.placeOrder(orderPlaceDTO);
        return ResponseEntity.ok(orderDTO);
    }

    @GetMapping("/viewOrders/{id}")
    public ResponseEntity<List<ViewOrdersDTO>> getOrders(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Order : {}", id);
        List<ViewOrdersDTO> viewOrdersDTOList = orderService.findByUserId1(id);
        return ResponseEntity.ok(viewOrdersDTOList);
    }

    @PostMapping("/deleteOrder")
    public ResponseEntity<String> cancelOrder(@RequestBody OrderCancelOrRefundDTO request) {
        boolean success = orderService.cancelOrderById(request.getId());
        if (success) {
            return ResponseEntity.ok("Order cancelled successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found or already cancelled");
        }
    }

    @PostMapping("/refundOrder")
    public ResponseEntity<String> refundOrder(@RequestBody OrderCancelOrRefundDTO request) {
        boolean success = orderService.refundOrderById(request.getId());
        if (success) {
            return ResponseEntity.ok("Order refund successfully");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found");
        }
    }
}
