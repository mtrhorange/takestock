package com.ecommerce.order.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.ecommerce.order.domain.Payment} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class PaymentDTO implements Serializable {

    private Long id;

    private String paymentMethod;

    private String transactionId;

    private String paymentStatus;

    private Instant paymentDate;

    private OrderDTO order;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Instant getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(Instant paymentDate) {
        this.paymentDate = paymentDate;
    }

    public OrderDTO getOrder() {
        return order;
    }

    public void setOrder(OrderDTO order) {
        this.order = order;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof PaymentDTO)) {
            return false;
        }

        PaymentDTO paymentDTO = (PaymentDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, paymentDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "PaymentDTO{" +
            "id=" + getId() +
            ", paymentMethod='" + getPaymentMethod() + "'" +
            ", transactionId='" + getTransactionId() + "'" +
            ", paymentStatus='" + getPaymentStatus() + "'" +
            ", paymentDate='" + getPaymentDate() + "'" +
            ", order=" + getOrder() +
            "}";
    }
}
