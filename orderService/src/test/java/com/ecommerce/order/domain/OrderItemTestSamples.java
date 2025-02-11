package com.ecommerce.order.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class OrderItemTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static OrderItem getOrderItemSample1() {
        return new OrderItem().id(1L).orderId(1L).productId("productId1").quantity(1);
    }

    public static OrderItem getOrderItemSample2() {
        return new OrderItem().id(2L).orderId(2L).productId("productId2").quantity(2);
    }

    public static OrderItem getOrderItemRandomSampleGenerator() {
        return new OrderItem()
            .id(longCount.incrementAndGet())
            .orderId(longCount.incrementAndGet())
            .productId(UUID.randomUUID().toString())
            .quantity(intCount.incrementAndGet());
    }
}
