package com.ecommerce.product.domain;

import java.util.UUID;

public class UserActivityTestSamples {

    public static UserActivity getUserActivitySample1() {
        return new UserActivity().id("id1").userId("userId1").productId("productId1").action("action1");
    }

    public static UserActivity getUserActivitySample2() {
        return new UserActivity().id("id2").userId("userId2").productId("productId2").action("action2");
    }

    public static UserActivity getUserActivityRandomSampleGenerator() {
        return new UserActivity()
            .id(UUID.randomUUID().toString())
            .userId(UUID.randomUUID().toString())
            .productId(UUID.randomUUID().toString())
            .action(UUID.randomUUID().toString());
    }
}
