package com.ecommerce.user.service.mapper;

import com.ecommerce.user.domain.User;
import com.ecommerce.user.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link User} and its DTO {@link UserDTO}.
 */
@Mapper(componentModel = "spring")
public interface UserMapper extends EntityMapper<UserDTO, User> {}
