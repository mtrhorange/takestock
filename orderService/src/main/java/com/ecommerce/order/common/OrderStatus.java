package com.ecommerce.order.common;

public enum OrderStatus {
    PENDING, // Order has been placed but not paid.
    PAID, // Payment received, waiting for processing.
    PROCESSING, // Seller is preparing the order.
    SHIPPED, // Order has been handed over to the logistics partner.
    TO_RECEIVE, // Parcel is out for delivery.
    COMPLETED, // Order successfully delivered.
    CANCELLED, // Order cancelled before shipment.
    RETURN_REFUND // Buyer initiated a return/refund request.
}
