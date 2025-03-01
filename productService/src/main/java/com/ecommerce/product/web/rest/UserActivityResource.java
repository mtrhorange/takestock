package com.ecommerce.product.web.rest;

import com.ecommerce.product.repository.UserActivityRepository;
import com.ecommerce.product.service.UserActivityService;
import com.ecommerce.product.service.dto.UserActivityDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

/**
 * REST controller for managing {@link com.ecommerce.product.domain.UserActivity}.
 */
@RestController
@RequestMapping("/api/user-activities")
public class UserActivityResource {

    private static final Logger LOG = LoggerFactory.getLogger(UserActivityResource.class);

    private static final String ENTITY_NAME = "productServiceUserActivity";
    private final UserActivityService userActivityService;
    private final UserActivityRepository userActivityRepository;
    //    @Value("${jhipster.clientApp.name}")
    private String applicationName = "productService";

    public UserActivityResource(UserActivityService userActivityService, UserActivityRepository userActivityRepository) {
        this.userActivityService = userActivityService;
        this.userActivityRepository = userActivityRepository;
    }

    /**
     * {@code POST  /user-activities} : Create a new userActivity.
     *
     * @param userActivityDTO the userActivityDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userActivityDTO, or with status {@code 400 (Bad Request)} if the userActivity has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<UserActivityDTO> createUserActivity(@Valid @RequestBody UserActivityDTO userActivityDTO)
            throws URISyntaxException {
        LOG.debug("REST request to save UserActivity : {}", userActivityDTO);
        if (userActivityDTO.getId() != null) {
            throw new BadRequestException("A new userActivity cannot already have an ID");
        }
        userActivityDTO = userActivityService.save(userActivityDTO);
        return ResponseEntity.created(new URI("/api/user-activities/" + userActivityDTO.getId()))
//            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, userActivityDTO.getId()))
                .body(userActivityDTO);
    }

    /**
     * {@code PUT  /user-activities/:id} : Updates an existing userActivity.
     *
     * @param id              the id of the userActivityDTO to save.
     * @param userActivityDTO the userActivityDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userActivityDTO,
     * or with status {@code 400 (Bad Request)} if the userActivityDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userActivityDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserActivityDTO> updateUserActivity(
            @PathVariable(value = "id", required = false) final String id,
            @Valid @RequestBody UserActivityDTO userActivityDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update UserActivity : {}, {}", id, userActivityDTO);
        if (userActivityDTO.getId() == null) {
            throw new BadRequestException("Invalid id");
        }
        if (!Objects.equals(id, userActivityDTO.getId())) {
            throw new BadRequestException("Invalid ID");
        }

        if (!userActivityRepository.existsById(id)) {
            throw new BadRequestException("Entity not found");
        }

        userActivityDTO = userActivityService.update(userActivityDTO);
        return ResponseEntity.ok()
//            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userActivityDTO.getId()))
                .body(userActivityDTO);
    }

    /**
     * {@code PATCH  /user-activities/:id} : Partial updates given fields of an existing userActivity, field will ignore if it is null
     *
     * @param id              the id of the userActivityDTO to save.
     * @param userActivityDTO the userActivityDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userActivityDTO,
     * or with status {@code 400 (Bad Request)} if the userActivityDTO is not valid,
     * or with status {@code 404 (Not Found)} if the userActivityDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the userActivityDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = {"application/json", "application/merge-patch+json"})
    public ResponseEntity<UserActivityDTO> partialUpdateUserActivity(
            @PathVariable(value = "id", required = false) final String id,
            @NotNull @RequestBody UserActivityDTO userActivityDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update UserActivity partially : {}, {}", id, userActivityDTO);
        if (userActivityDTO.getId() == null) {
            throw new BadRequestException("Invalid id");
        }
        if (!Objects.equals(id, userActivityDTO.getId())) {
            throw new BadRequestException("Invalid ID");
        }

        if (!userActivityRepository.existsById(id)) {
            throw new BadRequestException("Entity not found");
        }

        Optional<UserActivityDTO> result = userActivityService.partialUpdate(userActivityDTO);

        return ResponseEntity.ok(result.orElseThrow());
    }

    /**
     * {@code GET  /user-activities} : get all the userActivities.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userActivities in body.
     */
    @GetMapping("")
    public List<UserActivityDTO> getAllUserActivities() {
        LOG.debug("REST request to get all UserActivities");
        return userActivityService.findAll();
    }

    /**
     * {@code GET  /user-activities/:id} : get the "id" userActivity.
     *
     * @param id the id of the userActivityDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userActivityDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserActivityDTO> getUserActivity(@PathVariable("id") String id) {
        LOG.debug("REST request to get UserActivity : {}", id);
        Optional<UserActivityDTO> userActivityDTO = userActivityService.findOne(id);
        return ResponseEntity.ok(userActivityDTO.orElseThrow());
    }

    /**
     * {@code DELETE  /user-activities/:id} : delete the "id" userActivity.
     *
     * @param id the id of the userActivityDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUserActivity(@PathVariable("id") String id) {
        LOG.debug("REST request to delete UserActivity : {}", id);
        userActivityService.delete(id);
        return ResponseEntity.noContent()
//                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id))
                .build();
    }
}
