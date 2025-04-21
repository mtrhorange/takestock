package com.ecommerce.order.service.dto;

import java.io.Serializable;

public class OrderCancelOrRefundDTO implements Serializable {
    private Long id;

    // getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
