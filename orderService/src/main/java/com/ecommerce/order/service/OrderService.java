package com.ecommerce.order.service;

import com.ecommerce.order.common.OrderStatus;
import com.ecommerce.order.domain.Order;
import com.ecommerce.order.domain.OrderItem;
import com.ecommerce.order.domain.Payment;
import com.ecommerce.order.repository.OrderItemRepository;
import com.ecommerce.order.repository.OrderRepository;
import com.ecommerce.order.repository.PaymentRepository;
import com.ecommerce.order.service.dto.*;
import com.ecommerce.order.service.mapper.OrderItemMapper;
import com.ecommerce.order.service.mapper.OrderMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

/**
 * Service Implementation for managing {@link com.ecommerce.order.domain.Order}.
 */
@Service
@Transactional
public class OrderService {

    private static final Logger LOG = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;

    @Autowired
    private final OrderMapper orderMapper;

    @Autowired
    private final OrderItemMapper orderItemMapper;

    private final OrderItemRepository orderItemRepository;

    private final PaymentRepository paymentRepository;

    public OrderService(
            OrderRepository orderRepository, OrderMapper orderMapper, OrderItemMapper orderItemMapper,
            OrderItemRepository orderItemRepository, PaymentRepository paymentRepository
    ) {
        this.orderRepository = orderRepository;
        this.orderMapper = orderMapper;
        this.orderItemMapper = orderItemMapper;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
    }

    /**
     * Save a order.
     *
     * @param orderDTO the entity to save.
     * @return the persisted entity.
     */
    public OrderDTO save(OrderDTO orderDTO) {
        LOG.debug("Request to save Order : {}", orderDTO);
        Order order = orderMapper.toEntity(orderDTO);
        order = orderRepository.save(order);
        return orderMapper.toDto(order);
    }

    /**
     * Update a order.
     *
     * @param orderDTO the entity to save.
     * @return the persisted entity.
     */
    public OrderDTO update(OrderDTO orderDTO) {
        LOG.debug("Request to update Order : {}", orderDTO);
        Order order = orderMapper.toEntity(orderDTO);
        order = orderRepository.save(order);
        return orderMapper.toDto(order);
    }

    /**
     * Partially update a order.
     *
     * @param orderDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<OrderDTO> partialUpdate(OrderDTO orderDTO) {
        LOG.debug("Request to partially update Order : {}", orderDTO);
        return orderRepository
                .findById(orderDTO.getId())
                .map(existingOrder -> {
                    orderMapper.partialUpdate(existingOrder, orderDTO);

                    return existingOrder;
                })
                .map(orderRepository::save)
                .map(orderMapper::toDto);
    }

    /**
     * Get all the orders.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<OrderDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Orders");
        return orderRepository.findAll(pageable).map(orderMapper::toDto);
    }

    /**
     * Get all the orders where Payment is {@code null}.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<OrderDTO> findAllWherePaymentIsNull() {
        LOG.debug("Request to get all orders where Payment is null");
        return StreamSupport.stream(orderRepository.findAll().spliterator(), false)
                .filter(order -> order.getPayment() == null)
                .map(orderMapper::toDto)
                .collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one order by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<OrderDTO> findOne(Long id) {
        LOG.debug("Request to get Order : {}", id);
        return orderRepository.findById(id).map(orderMapper::toDto);
    }

    /**
     * Delete the order by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Order : {}", id);
        orderRepository.deleteById(id);
    }

    public OrderDTO placeOrder(OrderPlaceDTO orderPlaceDTO) {
        Order order = new Order();
        order.setUserId1(orderPlaceDTO.getUserId1());
        order.setTotalPrice(orderPlaceDTO.getTotalPrice());
        order.setOrderStatus(OrderStatus.PAID.toString()); // Start as PENDING
        order.setPaymentStatus("SUCCESS");
        order.setCreatedDate(Instant.now());

        order = orderRepository.save(order);

        // Save Order Items
        for (ProductsOrderDTO product : orderPlaceDTO.getProductsOrder()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProductId(product.getProductId());
            orderItem.setQuantity(product.getQty());
            orderItem.setPrice(product.getPrice());

            orderItemRepository.save(orderItem);
        }

        // Save Payment Record
        String defaultPaymentMethod = "PayNow";
        String generatedTransactionId = UUID.randomUUID().toString(); // Generate a unique transaction ID

        Payment payment = new Payment();
        payment.setOrder(order);
        payment.setPaymentMethod(defaultPaymentMethod);
        payment.setTransactionId(generatedTransactionId);
        payment.setPaymentStatus("SUCCESS");
        payment.setPaymentDate(Instant.now());

        paymentRepository.save(payment);

        return orderMapper.toDto(order);
    }

    @Transactional(readOnly = true)
    public List<ViewOrdersDTO> findByUserId1(Long id) {
        LOG.debug("Request to get Order : {}", id);

        List<OrderDTO> orderDTOList = orderRepository.findByUserId1(id).stream().map(orderMapper::toDto).toList();
        if (orderDTOList.isEmpty()) {
            return null;
        }
        List<ViewOrdersDTO> viewOrdersDTOList = orderDTOList.stream().map(orderDTO -> {
            List<OrderItemDTO> orderItemDTOList = orderItemRepository.findByOrderId(orderDTO.getId())
                    .stream()
                    .map(orderItemMapper::toDto)
                    .toList();
            ViewOrdersDTO viewOrdersDTO = new ViewOrdersDTO();
            viewOrdersDTO.setOrderDTO(orderDTO);
            viewOrdersDTO.setOrderItemDTOList(orderItemDTOList);
            return viewOrdersDTO;
        }).toList();
        return viewOrdersDTOList;
    }
}
