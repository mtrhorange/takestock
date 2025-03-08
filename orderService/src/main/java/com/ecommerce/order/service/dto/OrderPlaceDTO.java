package com.ecommerce.order.service.dto;

import java.math.BigDecimal;
import java.util.List;

public class OrderPlaceDTO {
    private Long userId1;

    private BigDecimal totalPrice;

    private List<ProductsOrderDTO> productsOrder;

    public Long getUserId1() {
        return userId1;
    }

    public void setUserId1(Long userId1) {
        this.userId1 = userId1;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public List<ProductsOrderDTO> getProductsOrder() {
        return productsOrder;
    }

    public void setProductsOrder(List<ProductsOrderDTO> productsOrder) {
        this.productsOrder = productsOrder;
    }
}
