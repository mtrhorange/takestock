package com.ecommerce.product.service.mapper;

import com.ecommerce.product.domain.UserActivity;
import com.ecommerce.product.service.dto.UserActivityDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link UserActivity} and its DTO {@link UserActivityDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserActivityMapper extends EntityMapper<UserActivityDTO, UserActivity> {}
