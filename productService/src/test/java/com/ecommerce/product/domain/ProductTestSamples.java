package com.ecommerce.product.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class ProductTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Product getProductSample1() {
        return new Product()
            .id("id1")
            .name("name1")
            .description("description1")
            .category("category1")
            .brand("brand1")
            .stock(1)
            .imageUrl("imageUrl1");
    }

    public static Product getProductSample2() {
        return new Product()
            .id("id2")
            .name("name2")
            .description("description2")
            .category("category2")
            .brand("brand2")
            .stock(2)
            .imageUrl("imageUrl2");
    }

    public static Product getProductRandomSampleGenerator() {
        return new Product()
            .id(UUID.randomUUID().toString())
            .name(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .category(UUID.randomUUID().toString())
            .brand(UUID.randomUUID().toString())
            .stock(intCount.incrementAndGet())
            .imageUrl(UUID.randomUUID().toString());
    }
}
