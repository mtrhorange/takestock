package com.ecommerce.order.service;

import com.ecommerce.order.domain.Payment;
import com.ecommerce.order.repository.PaymentRepository;
import com.ecommerce.order.service.dto.PaymentDTO;
import com.ecommerce.order.service.mapper.PaymentMapper;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.ecommerce.order.domain.Payment}.
 */
@Service
@Transactional
public class PaymentService {

    private static final Logger LOG = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;

    // private final PaymentMapper paymentMapper;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
        // this.paymentMapper = paymentMapper;
    }

    /**
     * Save a payment.
     *
     * @param paymentDTO the entity to save.
     * @return the persisted entity.
     */
    public PaymentDTO save(PaymentDTO paymentDTO) {
        LOG.debug("Request to save Payment : {}", paymentDTO);
        return null;
        // Payment payment = paymentMapper.toEntity(paymentDTO);
        // payment = paymentRepository.save(payment);
        // return paymentMapper.toDto(payment);
    }

    /**
     * Update a payment.
     *
     * @param paymentDTO the entity to save.
     * @return the persisted entity.
     */
    public PaymentDTO update(PaymentDTO paymentDTO) {
        LOG.debug("Request to update Payment : {}", paymentDTO);
        return null;
        // Payment payment = paymentMapper.toEntity(paymentDTO);
        // payment = paymentRepository.save(payment);
        // return paymentMapper.toDto(payment);
    }

    /**
     * Partially update a payment.
     *
     * @param paymentDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<PaymentDTO> partialUpdate(PaymentDTO paymentDTO) {
        LOG.debug("Request to partially update Payment : {}", paymentDTO);

        return null;
        // return paymentRepository
        //     .findById(paymentDTO.getId())
        //     .map(existingPayment -> {
        //         paymentMapper.partialUpdate(existingPayment, paymentDTO);
        //
        //         return existingPayment;
        //     })
        //     .map(paymentRepository::save)
        //     .map(paymentMapper::toDto);
    }

    /**
     * Get all the payments.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<PaymentDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Payments");
        return null;
        // return paymentRepository.findAll(pageable).map(paymentMapper::toDto);
    }

    /**
     * Get one payment by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<PaymentDTO> findOne(Long id) {
        LOG.debug("Request to get Payment : {}", id);
        return null;
        // return paymentRepository.findById(id).map(paymentMapper::toDto);
    }

    /**
     * Delete the payment by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Payment : {}", id);
        paymentRepository.deleteById(id);
    }
}
