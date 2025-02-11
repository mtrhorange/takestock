package com.ecommerce.order.domain;

import static com.ecommerce.order.domain.OrderItemTestSamples.*;
import static com.ecommerce.order.domain.OrderTestSamples.*;
import static com.ecommerce.order.domain.PaymentTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ecommerce.order.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class OrderTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Order.class);
        Order order1 = getOrderSample1();
        Order order2 = new Order();
        assertThat(order1).isNotEqualTo(order2);

        order2.setId(order1.getId());
        assertThat(order1).isEqualTo(order2);

        order2 = getOrderSample2();
        assertThat(order1).isNotEqualTo(order2);
    }

    @Test
    void orderItemsTest() {
        Order order = getOrderRandomSampleGenerator();
        OrderItem orderItemBack = getOrderItemRandomSampleGenerator();

        order.addOrderItems(orderItemBack);
        assertThat(order.getOrderItems()).containsOnly(orderItemBack);
        assertThat(orderItemBack.getOrder()).isEqualTo(order);

        order.removeOrderItems(orderItemBack);
        assertThat(order.getOrderItems()).doesNotContain(orderItemBack);
        assertThat(orderItemBack.getOrder()).isNull();

        order.orderItems(new HashSet<>(Set.of(orderItemBack)));
        assertThat(order.getOrderItems()).containsOnly(orderItemBack);
        assertThat(orderItemBack.getOrder()).isEqualTo(order);

        order.setOrderItems(new HashSet<>());
        assertThat(order.getOrderItems()).doesNotContain(orderItemBack);
        assertThat(orderItemBack.getOrder()).isNull();
    }

    @Test
    void paymentTest() {
        Order order = getOrderRandomSampleGenerator();
        Payment paymentBack = getPaymentRandomSampleGenerator();

        order.setPayment(paymentBack);
        assertThat(order.getPayment()).isEqualTo(paymentBack);
        assertThat(paymentBack.getOrder()).isEqualTo(order);

        order.payment(null);
        assertThat(order.getPayment()).isNull();
        assertThat(paymentBack.getOrder()).isNull();
    }
}
