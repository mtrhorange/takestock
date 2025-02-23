package com.ecommerce.product.domain;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A UserActivity.
 */
@Document(collection = "user_activity")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserActivity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("user_id_1")
    private String userId1;

    @NotNull
    @Field("product_id")
    private String productId;

    @NotNull
    @Field("action")
    private String action;

    @NotNull
    @Field("timestamp")
    private Instant timestamp;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public UserActivity id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId1() {
        return this.userId1;
    }

    public UserActivity userId1(String userId1) {
        this.setUserId1(userId1);
        return this;
    }

    public void setUserId1(String userId1) {
        this.userId1 = userId1;
    }

    public String getProductId() {
        return this.productId;
    }

    public UserActivity productId(String productId) {
        this.setProductId(productId);
        return this;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getAction() {
        return this.action;
    }

    public UserActivity action(String action) {
        this.setAction(action);
        return this;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Instant getTimestamp() {
        return this.timestamp;
    }

    public UserActivity timestamp(Instant timestamp) {
        this.setTimestamp(timestamp);
        return this;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserActivity)) {
            return false;
        }
        return getId() != null && getId().equals(((UserActivity) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserActivity{" +
            "id=" + getId() +
            ", userId1='" + getUserId1() + "'" +
            ", productId='" + getProductId() + "'" +
            ", action='" + getAction() + "'" +
            ", timestamp='" + getTimestamp() + "'" +
            "}";
    }
}
