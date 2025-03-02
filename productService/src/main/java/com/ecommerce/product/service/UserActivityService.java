package com.ecommerce.product.service;

import com.ecommerce.product.domain.UserActivity;
import com.ecommerce.product.repository.UserActivityRepository;
import com.ecommerce.product.service.dto.UserActivityDTO;
import com.ecommerce.product.service.mapper.UserActivityMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link com.ecommerce.product.domain.UserActivity}.
 */
@Service
public class UserActivityService {

    private static final Logger LOG = LoggerFactory.getLogger(UserActivityService.class);

    private final UserActivityRepository userActivityRepository;

    private final UserActivityMapper userActivityMapper;

    public UserActivityService(UserActivityRepository userActivityRepository, UserActivityMapper userActivityMapper) {
        this.userActivityRepository = userActivityRepository;
        this.userActivityMapper = userActivityMapper;
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

}
