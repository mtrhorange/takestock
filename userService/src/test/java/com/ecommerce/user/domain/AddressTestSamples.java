package com.ecommerce.user.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AddressTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Address getAddressSample1() {
        return new Address()
            .id(1L)
            .userId(1L)
            .street("street1")
            .city("city1")
            .state("state1")
            .country("country1")
            .postalCode("postalCode1");
    }

    public static Address getAddressSample2() {
        return new Address()
            .id(2L)
            .userId(2L)
            .street("street2")
            .city("city2")
            .state("state2")
            .country("country2")
            .postalCode("postalCode2");
    }

    public static Address getAddressRandomSampleGenerator() {
        return new Address()
            .id(longCount.incrementAndGet())
            .userId(longCount.incrementAndGet())
            .street(UUID.randomUUID().toString())
            .city(UUID.randomUUID().toString())
            .state(UUID.randomUUID().toString())
            .country(UUID.randomUUID().toString())
            .postalCode(UUID.randomUUID().toString());
    }
}
