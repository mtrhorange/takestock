package com.ecommerce.product.repository;

import com.ecommerce.product.domain.UserActivity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the UserActivity entity.
 */
@Repository
public interface UserActivityRepository extends MongoRepository<UserActivity, String> {}
