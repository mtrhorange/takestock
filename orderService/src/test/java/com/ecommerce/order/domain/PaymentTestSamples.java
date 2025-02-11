package com.ecommerce.order.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class PaymentTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Payment getPaymentSample1() {
        return new Payment()
            .id(1L)
            .orderId(1L)
            .paymentMethod("paymentMethod1")
            .transactionId("transactionId1")
            .paymentStatus("paymentStatus1");
    }

    public static Payment getPaymentSample2() {
        return new Payment()
            .id(2L)
            .orderId(2L)
            .paymentMethod("paymentMethod2")
            .transactionId("transactionId2")
            .paymentStatus("paymentStatus2");
    }

    public static Payment getPaymentRandomSampleGenerator() {
        return new Payment()
            .id(longCount.incrementAndGet())
            .orderId(longCount.incrementAndGet())
            .paymentMethod(UUID.randomUUID().toString())
            .transactionId(UUID.randomUUID().toString())
            .paymentStatus(UUID.randomUUID().toString());
    }
}
