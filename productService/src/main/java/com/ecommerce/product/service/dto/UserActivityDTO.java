package com.ecommerce.product.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.ecommerce.product.domain.UserActivity} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserActivityDTO implements Serializable {

    private String id;

    @NotNull
    private String userId;

    @NotNull
    private String productId;

    @NotNull
    private String action;

    @NotNull
    private Instant timestamp;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserActivityDTO)) {
            return false;
        }

        UserActivityDTO userActivityDTO = (UserActivityDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, userActivityDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserActivityDTO{" +
            "id='" + getId() + "'" +
            ", userId='" + getUserId() + "'" +
            ", productId='" + getProductId() + "'" +
            ", action='" + getAction() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
