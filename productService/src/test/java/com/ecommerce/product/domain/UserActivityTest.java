package com.ecommerce.product.domain;

import static com.ecommerce.product.domain.UserActivityTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.ecommerce.product.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UserActivityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserActivity.class);
        UserActivity userActivity1 = getUserActivitySample1();
        UserActivity userActivity2 = new UserActivity();
        assertThat(userActivity1).isNotEqualTo(userActivity2);

        userActivity2.setId(userActivity1.getId());
        assertThat(userActivity1).isEqualTo(userActivity2);

        userActivity2 = getUserActivitySample2();
        assertThat(userActivity1).isNotEqualTo(userActivity2);
    }
}
