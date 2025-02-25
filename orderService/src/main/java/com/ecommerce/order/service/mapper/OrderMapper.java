package com.ecommerce.order.service.mapper;

import com.ecommerce.order.domain.Order;
import com.ecommerce.order.service.dto.OrderDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Order} and its DTO {@link OrderDTO}.
 */
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.WARN)
public interface OrderMapper extends EntityMapper<OrderDTO, Order> {}
