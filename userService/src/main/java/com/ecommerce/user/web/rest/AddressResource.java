package com.ecommerce.user.web.rest;

import com.ecommerce.user.repository.AddressRepository;
import com.ecommerce.user.service.AddressService;
import com.ecommerce.user.service.dto.AddressDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import jakarta.ws.rs.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing {@link com.ecommerce.user.domain.Address}.
 */
@RestController
@RequestMapping("/api/addresses")
public class AddressResource {

    private static final Logger LOG = LoggerFactory.getLogger(AddressResource.class);

    private static final String ENTITY_NAME = "userServiceAddress";

    private String applicationName = "userService";

    private final AddressService addressService;

    private final AddressRepository addressRepository;

    public AddressResource(AddressService addressService, AddressRepository addressRepository) {
        this.addressService = addressService;
        this.addressRepository = addressRepository;
    }

    /**
     * {@code POST  /addresses} : Create a new address.
     *
     * @param addressDTO the addressDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new addressDTO, or with status {@code 400 (Bad Request)} if the address has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO) throws URISyntaxException {
        LOG.debug("REST request to save Address : {}", addressDTO);
        if (addressDTO.getId() != null) {
            throw new BadRequestException("A new address cannot already have an ID");
        }
        addressDTO = addressService.save(addressDTO);
        return ResponseEntity.created(new URI("/api/addresses/" + addressDTO.getId()))
//            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, addressDTO.getId().toString()))
            .body(addressDTO);
    }

    /**
     * {@code PUT  /addresses/:id} : Updates an existing address.
     *
     * @param id the id of the addressDTO to save.
     * @param addressDTO the addressDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated addressDTO,
     * or with status {@code 400 (Bad Request)} if the addressDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the addressDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AddressDTO> updateAddress(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody AddressDTO addressDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update Address : {}, {}", id, addressDTO);
        if (addressDTO.getId() == null) {
            throw new BadRequestException("Invalid id");
        }
        if (!Objects.equals(id, addressDTO.getId())) {
            throw new BadRequestException("Invalid ID");
        }

        if (!addressRepository.existsById(id)) {
            throw new BadRequestException("Entity not found");
        }

        addressDTO = addressService.update(addressDTO);
        return ResponseEntity.ok()
//            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, addressDTO.getId().toString()))
            .body(addressDTO);
    }

    /**
     * {@code PATCH  /addresses/:id} : Partial updates given fields of an existing address, field will ignore if it is null
     *
     * @param id the id of the addressDTO to save.
     * @param addressDTO the addressDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated addressDTO,
     * or with status {@code 400 (Bad Request)} if the addressDTO is not valid,
     * or with status {@code 404 (Not Found)} if the addressDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the addressDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AddressDTO> partialUpdateAddress(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody AddressDTO addressDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Address partially : {}, {}", id, addressDTO);
        if (addressDTO.getId() == null) {
            throw new BadRequestException("Invalid id");
        }
        if (!Objects.equals(id, addressDTO.getId())) {
            throw new BadRequestException("Invalid ID");
        }

        if (!addressRepository.existsById(id)) {
            throw new BadRequestException("Entity not found");
        }

        Optional<AddressDTO> result = addressService.partialUpdate(addressDTO);
        return ResponseEntity.ok(result.orElseThrow());
//        return ResponseUtil.wrapOrNotFound(
//            result,
//            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, addressDTO.getId().toString())
//        );
    }

    /**
     * {@code GET  /addresses} : get all the addresses.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of addresses in body.
     */
    @GetMapping("")
    public List<AddressDTO> getAllAddresses() {
        LOG.debug("REST request to get all Addresses");
        return addressService.findAll();
    }

    /**
     * {@code GET  /addresses/:id} : get the "id" address.
     *
     * @param id the id of the addressDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the addressDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AddressDTO> getAddress(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Address : {}", id);
        Optional<AddressDTO> addressDTO = addressService.findOne(id);
        return ResponseEntity.ok(addressDTO.orElseThrow());
//        return ResponseUtil.wrapOrNotFound(addressDTO);
    }

    /**
     * {@code DELETE  /addresses/:id} : delete the "id" address.
     *
     * @param id the id of the addressDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Address : {}", id);
        addressService.delete(id);
        return ResponseEntity.noContent()
//            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
