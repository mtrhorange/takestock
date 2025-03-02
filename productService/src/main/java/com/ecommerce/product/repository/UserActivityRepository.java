package com.ecommerce.product.repository;

import com.ecommerce.product.domain.UserActivity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data MongoDB repository for the UserActivity entity.
 */
@Repository
public interface UserActivityRepository extends MongoRepository<UserActivity, String> {
    Optional<UserActivity> findByUserId1AndProductIdAndAction(String userId1, String productId, String action);

    List<UserActivity> findByUserId1(String userId1);

    List<UserActivity> findByProductId(String productId);
}
