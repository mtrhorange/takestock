-- Insert into jhi_authority
INSERT INTO jhi_authority (name) VALUES
('ROLE_ADMIN'),
('ROLE_USER');

-- Insert into jhi_user
INSERT INTO jhi_user (
    id, login, password_hash, first_name, last_name, email, image_url,
    activated, lang_key, created_by, created_date, last_modified_by, last_modified_date
) VALUES
(1, 'admin', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC',
 'Administrator', 'Administrator', 'admin@localhost', NULL,
 TRUE, 'en', 'system', '2025-02-28 12:00:00', 'system', '2025-02-28 12:00:00'),
(2, 'user', '$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K',
 'User', 'User', 'user@localhost', NULL,
 TRUE, 'en', 'system', '2025-02-28 12:00:00', 'system', '2025-02-28 12:00:00');

-- Insert into jhi_user_authority
INSERT INTO jhi_user_authority (user_id, authority_name) VALUES
(1, 'ROLE_ADMIN'),
(1, 'ROLE_USER'),
(2, 'ROLE_USER');

-- Insert into address
INSERT INTO address (id, user_id_1, street, city, state, country, postal_code) VALUES
(1, 1, 'Stoney Lane', 'Fort Pierce', 'pick uneven distinct', 'Albania', 'frizz gradient'),
(2, 2, 'E Franklin Street', 'Pembroke Pines', 'anti', 'Slovenia', 'whereas');
