package com.ecommerce.user.service.mapper;

import com.ecommerce.user.domain.Address;
import com.ecommerce.user.domain.User;
import com.ecommerce.user.service.dto.AddressDTO;
import com.ecommerce.user.service.dto.UserDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Address} and its DTO {@link AddressDTO}.
 */
@Mapper(componentModel = "spring")
public interface AddressMapper extends EntityMapper<AddressDTO, Address> {
    @Mapping(target = "user", source = "user", qualifiedByName = "userId")
    AddressDTO toDto(Address s);

    @Named("userId")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    UserDTO toDtoUserId(User user);
}
