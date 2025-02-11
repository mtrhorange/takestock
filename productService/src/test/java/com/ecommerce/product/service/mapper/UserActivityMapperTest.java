package com.ecommerce.product.service.mapper;

import static com.ecommerce.product.domain.UserActivityAsserts.*;
import static com.ecommerce.product.domain.UserActivityTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class UserActivityMapperTest {

    private UserActivityMapper userActivityMapper;

    @BeforeEach
    void setUp() {
        userActivityMapper = new UserActivityMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getUserActivitySample1();
        var actual = userActivityMapper.toEntity(userActivityMapper.toDto(expected));
        assertUserActivityAllPropertiesEquals(expected, actual);
    }
}
