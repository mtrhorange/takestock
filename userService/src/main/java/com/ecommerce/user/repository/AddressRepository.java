package com.ecommerce.user.repository;

import com.ecommerce.user.domain.Address;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Address entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {
    @Query("select address from Address address where address.user.login = ?#{authentication.name}")
    List<Address> findByUserIsCurrentUser();
}
