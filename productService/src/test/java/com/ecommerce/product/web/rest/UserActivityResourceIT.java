package com.ecommerce.product.web.rest;

import static com.ecommerce.product.domain.UserActivityAsserts.*;
import static com.ecommerce.product.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.ecommerce.product.IntegrationTest;
import com.ecommerce.product.domain.UserActivity;
import com.ecommerce.product.repository.UserActivityRepository;
import com.ecommerce.product.service.dto.UserActivityDTO;
import com.ecommerce.product.service.mapper.UserActivityMapper;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link UserActivityResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserActivityResourceIT {

    private static final String DEFAULT_USER_ID_1 = "AAAAAAAAAA";
    private static final String UPDATED_USER_ID_1 = "BBBBBBBBBB";

    private static final String DEFAULT_PRODUCT_ID = "AAAAAAAAAA";
    private static final String UPDATED_PRODUCT_ID = "BBBBBBBBBB";

    private static final String DEFAULT_ACTION = "AAAAAAAAAA";
    private static final String UPDATED_ACTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_TIMESTAMP = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_TIMESTAMP = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/user-activities";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Autowired
    private UserActivityMapper userActivityMapper;

    @Autowired
    private MockMvc restUserActivityMockMvc;

    private UserActivity userActivity;

    private UserActivity insertedUserActivity;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserActivity createEntity() {
        return new UserActivity()
            .userId1(DEFAULT_USER_ID_1)
            .productId(DEFAULT_PRODUCT_ID)
            .action(DEFAULT_ACTION)
            .timestamp(DEFAULT_TIMESTAMP);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static UserActivity createUpdatedEntity() {
        return new UserActivity()
            .userId1(UPDATED_USER_ID_1)
            .productId(UPDATED_PRODUCT_ID)
            .action(UPDATED_ACTION)
            .timestamp(UPDATED_TIMESTAMP);
    }

    @BeforeEach
    public void initTest() {
        userActivity = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedUserActivity != null) {
            userActivityRepository.delete(insertedUserActivity);
            insertedUserActivity = null;
        }
    }

    @Test
    void createUserActivity() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the UserActivity
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);
        var returnedUserActivityDTO = om.readValue(
            restUserActivityMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userActivityDTO)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            UserActivityDTO.class
        );

        // Validate the UserActivity in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        var returnedUserActivity = userActivityMapper.toEntity(returnedUserActivityDTO);
        assertUserActivityUpdatableFieldsEquals(returnedUserActivity, getPersistedUserActivity(returnedUserActivity));

        insertedUserActivity = returnedUserActivity;
    }

    @Test
    void createUserActivityWithExistingId() throws Exception {
        // Create the UserActivity with an existing ID
        userActivity.setId("existing_id");
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserActivityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userActivityDTO)))
            .andExpect(status().isBadRequest());

        // Validate the UserActivity in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    void checkUserId1IsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        userActivity.setUserId1(null);

        // Create the UserActivity, which fails.
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);

        restUserActivityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userActivityDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkProductIdIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        userActivity.setProductId(null);

        // Create the UserActivity, which fails.
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);

        restUserActivityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userActivityDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkActionIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        userActivity.setAction(null);

        // Create the UserActivity, which fails.
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);

        restUserActivityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userActivityDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void checkTimestampIsRequired() throws Exception {
        long databaseSizeBeforeTest = getRepositoryCount();
        // set the field null
        userActivity.setTimestamp(null);

        // Create the UserActivity, which fails.
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);

        restUserActivityMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userActivityDTO)))
            .andExpect(status().isBadRequest());

        assertSameRepositoryCount(databaseSizeBeforeTest);
    }

    @Test
    void getAllUserActivities() throws Exception {
        // Initialize the database
        insertedUserActivity = userActivityRepository.save(userActivity);

        // Get all the userActivityList
        restUserActivityMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userActivity.getId())))
            .andExpect(jsonPath("$.[*].userId1").value(hasItem(DEFAULT_USER_ID_1)))
            .andExpect(jsonPath("$.[*].productId").value(hasItem(DEFAULT_PRODUCT_ID)))
            .andExpect(jsonPath("$.[*].action").value(hasItem(DEFAULT_ACTION)))
            .andExpect(jsonPath("$.[*].timestamp").value(hasItem(DEFAULT_TIMESTAMP.toString())));
    }

    @Test
    void getUserActivity() throws Exception {
        // Initialize the database
        insertedUserActivity = userActivityRepository.save(userActivity);

        // Get the userActivity
        restUserActivityMockMvc
            .perform(get(ENTITY_API_URL_ID, userActivity.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userActivity.getId()))
            .andExpect(jsonPath("$.userId1").value(DEFAULT_USER_ID_1))
            .andExpect(jsonPath("$.productId").value(DEFAULT_PRODUCT_ID))
            .andExpect(jsonPath("$.action").value(DEFAULT_ACTION))
            .andExpect(jsonPath("$.timestamp").value(DEFAULT_TIMESTAMP.toString()));
    }

    @Test
    void getNonExistingUserActivity() throws Exception {
        // Get the userActivity
        restUserActivityMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putExistingUserActivity() throws Exception {
        // Initialize the database
        insertedUserActivity = userActivityRepository.save(userActivity);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userActivity
        UserActivity updatedUserActivity = userActivityRepository.findById(userActivity.getId()).orElseThrow();
        updatedUserActivity.userId1(UPDATED_USER_ID_1).productId(UPDATED_PRODUCT_ID).action(UPDATED_ACTION).timestamp(UPDATED_TIMESTAMP);
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(updatedUserActivity);

        restUserActivityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userActivityDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(userActivityDTO))
            )
            .andExpect(status().isOk());

        // Validate the UserActivity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedUserActivityToMatchAllProperties(updatedUserActivity);
    }

    @Test
    void putNonExistingUserActivity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userActivity.setId(UUID.randomUUID().toString());

        // Create the UserActivity
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserActivityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userActivityDTO.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(userActivityDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserActivity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchUserActivity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userActivity.setId(UUID.randomUUID().toString());

        // Create the UserActivity
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserActivityMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(userActivityDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserActivity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamUserActivity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userActivity.setId(UUID.randomUUID().toString());

        // Create the UserActivity
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserActivityMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(userActivityDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserActivity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateUserActivityWithPatch() throws Exception {
        // Initialize the database
        insertedUserActivity = userActivityRepository.save(userActivity);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userActivity using partial update
        UserActivity partialUpdatedUserActivity = new UserActivity();
        partialUpdatedUserActivity.setId(userActivity.getId());

        partialUpdatedUserActivity
            .userId1(UPDATED_USER_ID_1)
            .productId(UPDATED_PRODUCT_ID)
            .action(UPDATED_ACTION)
            .timestamp(UPDATED_TIMESTAMP);

        restUserActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserActivity.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUserActivity))
            )
            .andExpect(status().isOk());

        // Validate the UserActivity in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUserActivityUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedUserActivity, userActivity),
            getPersistedUserActivity(userActivity)
        );
    }

    @Test
    void fullUpdateUserActivityWithPatch() throws Exception {
        // Initialize the database
        insertedUserActivity = userActivityRepository.save(userActivity);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the userActivity using partial update
        UserActivity partialUpdatedUserActivity = new UserActivity();
        partialUpdatedUserActivity.setId(userActivity.getId());

        partialUpdatedUserActivity
            .userId1(UPDATED_USER_ID_1)
            .productId(UPDATED_PRODUCT_ID)
            .action(UPDATED_ACTION)
            .timestamp(UPDATED_TIMESTAMP);

        restUserActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserActivity.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedUserActivity))
            )
            .andExpect(status().isOk());

        // Validate the UserActivity in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertUserActivityUpdatableFieldsEquals(partialUpdatedUserActivity, getPersistedUserActivity(partialUpdatedUserActivity));
    }

    @Test
    void patchNonExistingUserActivity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userActivity.setId(UUID.randomUUID().toString());

        // Create the UserActivity
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userActivityDTO.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(userActivityDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserActivity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchUserActivity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userActivity.setId(UUID.randomUUID().toString());

        // Create the UserActivity
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserActivityMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(userActivityDTO))
            )
            .andExpect(status().isBadRequest());

        // Validate the UserActivity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamUserActivity() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        userActivity.setId(UUID.randomUUID().toString());

        // Create the UserActivity
        UserActivityDTO userActivityDTO = userActivityMapper.toDto(userActivity);

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserActivityMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(userActivityDTO)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the UserActivity in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteUserActivity() throws Exception {
        // Initialize the database
        insertedUserActivity = userActivityRepository.save(userActivity);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the userActivity
        restUserActivityMockMvc
            .perform(delete(ENTITY_API_URL_ID, userActivity.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return userActivityRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected UserActivity getPersistedUserActivity(UserActivity userActivity) {
        return userActivityRepository.findById(userActivity.getId()).orElseThrow();
    }

    protected void assertPersistedUserActivityToMatchAllProperties(UserActivity expectedUserActivity) {
        assertUserActivityAllPropertiesEquals(expectedUserActivity, getPersistedUserActivity(expectedUserActivity));
    }

    protected void assertPersistedUserActivityToMatchUpdatableProperties(UserActivity expectedUserActivity) {
        assertUserActivityAllUpdatablePropertiesEquals(expectedUserActivity, getPersistedUserActivity(expectedUserActivity));
    }
}
