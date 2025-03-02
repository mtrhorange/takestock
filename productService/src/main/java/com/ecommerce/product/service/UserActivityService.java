package com.ecommerce.product.service;

import com.ecommerce.product.domain.UserActivity;
import com.ecommerce.product.repository.ProductRepository;
import com.ecommerce.product.repository.UserActivityRepository;
import com.ecommerce.product.service.dto.ProductDTO;
import com.ecommerce.product.service.dto.UserActivityDTO;
import com.ecommerce.product.service.mapper.ProductMapper;
import com.ecommerce.product.service.mapper.UserActivityMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service Implementation for managing {@link com.ecommerce.product.domain.UserActivity}.
 */
@Service
public class UserActivityService {

    private static final Logger LOG = LoggerFactory.getLogger(UserActivityService.class);

    private final UserActivityRepository userActivityRepository;

    private final UserActivityMapper userActivityMapper;

    private final ProductRepository productRepository;

    private final ProductMapper productMapper;

    public UserActivityService(
            UserActivityRepository userActivityRepository,
            UserActivityMapper userActivityMapper,
            ProductRepository productRepository,
            ProductMapper productMapper
    ) {
        this.userActivityRepository = userActivityRepository;
        this.userActivityMapper = userActivityMapper;
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    /**
     * Save a userActivity.
     *
     * @param userActivityDTO the entity to save.
     * @return the persisted entity.
     */
    public UserActivityDTO save(UserActivityDTO userActivityDTO) {
        LOG.debug("Request to save UserActivity : {}", userActivityDTO);
        UserActivity userActivity = userActivityMapper.toEntity(userActivityDTO);
        userActivity = userActivityRepository.save(userActivity);
        return userActivityMapper.toDto(userActivity);
    }

    /**
     * Update a userActivity.
     *
     * @param userActivityDTO the entity to save.
     * @return the persisted entity.
     */
    public UserActivityDTO update(UserActivityDTO userActivityDTO) {
        LOG.debug("Request to update UserActivity : {}", userActivityDTO);
        UserActivity userActivity = userActivityMapper.toEntity(userActivityDTO);
        userActivity = userActivityRepository.save(userActivity);
        return userActivityMapper.toDto(userActivity);
    }

    /**
     * Partially update a userActivity.
     *
     * @param userActivityDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<UserActivityDTO> partialUpdate(UserActivityDTO userActivityDTO) {
        LOG.debug("Request to partially update UserActivity : {}", userActivityDTO);

        return userActivityRepository
                .findById(userActivityDTO.getId())
                .map(existingUserActivity -> {
                    userActivityMapper.partialUpdate(existingUserActivity, userActivityDTO);

                    return existingUserActivity;
                })
                .map(userActivityRepository::save)
                .map(userActivityMapper::toDto);
    }

    /**
     * Get all the userActivities.
     *
     * @return the list of entities.
     */
    public List<UserActivityDTO> findAll() {
        LOG.debug("Request to get all UserActivities");
        return userActivityRepository.findAll().stream().map(userActivityMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one userActivity by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<UserActivityDTO> findOne(String id) {
        LOG.debug("Request to get UserActivity : {}", id);
        return userActivityRepository.findById(id).map(userActivityMapper::toDto);
    }

    /**
     * Delete the userActivity by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        LOG.debug("Request to delete UserActivity : {}", id);
        userActivityRepository.deleteById(id);
    }

    public UserActivityDTO saveOrUpdate(UserActivityDTO userActivityDTO) {
        LOG.debug("Request to save or update UserActivity : {}", userActivityDTO);
        Optional<UserActivity> userActivityOptional = userActivityRepository.findByUserId1AndProductIdAndAction(userActivityDTO.getUserId1(), userActivityDTO.getProductId(), userActivityDTO.getAction());

        UserActivity userActivity = null;
        if (userActivityOptional.isPresent()) {
            userActivity = userActivityOptional.get();
            userActivity.setTimestamp(Instant.now());
        } else {
            userActivity = userActivityMapper.toEntity(userActivityDTO);
        }

        userActivity = userActivityRepository.save(userActivity);
        return userActivityMapper.toDto(userActivity);
    }

    public List<ProductDTO> getRecommendedProducts(String userId) {
        // Get products the user has interacted with
        List<UserActivity> userActivities = userActivityRepository.findByUserId1(userId);
        Set<String> viewedProductIds = userActivities.stream()
                .map(UserActivity::getProductId)
                .collect(Collectors.toSet());

        // Find other users who interacted with the same products
        Set<String> similarUserIds = new HashSet<>();
        for (String productId : viewedProductIds) {
            List<UserActivity> similarUsers = userActivityRepository.findByProductId(productId);
            for (UserActivity activity : similarUsers) {
                if (!activity.getUserId1().equals(userId)) {
                    similarUserIds.add(activity.getUserId1());
                }
            }
        }

        // Get products viewed by similar users
        Set<String> recommendedProductIds = new HashSet<>();
        for (String similarUserId : similarUserIds) {
            List<UserActivity> similarUserActivities = userActivityRepository.findByUserId1(similarUserId);
            for (UserActivity activity : similarUserActivities) {
                if (!viewedProductIds.contains(activity.getProductId())) {
                    recommendedProductIds.add(activity.getProductId());
                }
            }
        }

        return productRepository.findAllById(recommendedProductIds).stream()
                .map(productMapper::toDto).limit(5).collect(Collectors.toCollection(LinkedList::new));
    }
}
