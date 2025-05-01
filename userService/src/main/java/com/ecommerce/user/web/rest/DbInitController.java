package com.ecommerce.user.web.rest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/db")
public class DbInitController {

    private final DataSource dataSource;

    public DbInitController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @PostMapping("/orderservice")
    public ResponseEntity<String> initOrderService() {
        // DDL statements for orderservice
        List<String> sqls = List.of(
                // 1) Create the database
                """
                        CREATE DATABASE IF NOT EXISTS `orderservice`
                          /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */
                          /*!80016 DEFAULT ENCRYPTION='N' */;
                        """,
                // 2) Switch to it
                "USE `orderservice`;",
                // 3) Create the tables
                """
                        CREATE TABLE IF NOT EXISTS `jhi_order` (
                          `id` bigint NOT NULL AUTO_INCREMENT,
                          `created_date` datetime(6) DEFAULT NULL,
                          `order_status` varchar(255) NOT NULL,
                          `payment_status` varchar(255) NOT NULL,
                          `total_price` decimal(21,2) NOT NULL,
                          `user_id_1` bigint NOT NULL,
                          PRIMARY KEY (`id`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                        """,
                """
                        CREATE TABLE IF NOT EXISTS `order_item` (
                          `id` bigint NOT NULL AUTO_INCREMENT,
                          `price` decimal(21,2) NOT NULL,
                          `product_id` varchar(255) NOT NULL,
                          `quantity` int NOT NULL,
                          `order_id` bigint DEFAULT NULL,
                          PRIMARY KEY (`id`),
                          KEY `FK_order` (`order_id`),
                          CONSTRAINT `FK_order` FOREIGN KEY (`order_id`) REFERENCES `jhi_order`(`id`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                        """,
                """
                        CREATE TABLE IF NOT EXISTS `payment` (
                          `id` bigint NOT NULL AUTO_INCREMENT,
                          `payment_date` datetime(6) NOT NULL,
                          `payment_method` varchar(255) NOT NULL,
                          `payment_status` varchar(255) NOT NULL,
                          `transaction_id` varchar(255) NOT NULL,
                          `order_id` bigint DEFAULT NULL,
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `UK_payment_order` (`order_id`),
                          CONSTRAINT `FK_payment_order` FOREIGN KEY (`order_id`) REFERENCES `jhi_order`(`id`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                        """
        );

        return runAndIntrospectSchema("orderservice", sqls);
    }

    @PostMapping("/userservice")
    public ResponseEntity<String> initUserService() {
        // DDL statements for userservice
        List<String> sqls = List.of(
                // 1) Create the database
                """
                        CREATE DATABASE IF NOT EXISTS `userservice`
                          /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */
                          /*!80016 DEFAULT ENCRYPTION='N' */;
                        """,
                // 2) Switch to it
                "USE `userservice`;",
                // 3) Create the tables
                """
                        CREATE TABLE IF NOT EXISTS `address` (
                          `id` bigint NOT NULL AUTO_INCREMENT,
                          `city` varchar(255) NOT NULL,
                          `country` varchar(255) NOT NULL,
                          `postal_code` varchar(255) NOT NULL,
                          `state` varchar(255) NOT NULL,
                          `street` varchar(255) NOT NULL,
                          `user_id_1` bigint NOT NULL,
                          PRIMARY KEY (`id`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                        """,
                """
                        CREATE TABLE IF NOT EXISTS `jhi_authority` (
                          `name` varchar(50) NOT NULL,
                          PRIMARY KEY (`name`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                        """,
                """
                        CREATE TABLE IF NOT EXISTS `jhi_user` (
                          `id` bigint NOT NULL AUTO_INCREMENT,
                          `created_by` varchar(50) NOT NULL,
                          `created_date` datetime(6) DEFAULT NULL,
                          `last_modified_by` varchar(50) DEFAULT NULL,
                          `last_modified_date` datetime(6) DEFAULT NULL,
                          `activated` bit(1) NOT NULL,
                          `activation_key` varchar(20) DEFAULT NULL,
                          `email` varchar(254) DEFAULT NULL,
                          `first_name` varchar(50) DEFAULT NULL,
                          `image_url` varchar(256) DEFAULT NULL,
                          `lang_key` varchar(10) DEFAULT NULL,
                          `last_name` varchar(50) DEFAULT NULL,
                          `login` varchar(50) NOT NULL,
                          `password_hash` varchar(60) NOT NULL,
                          `reset_date` datetime(6) DEFAULT NULL,
                          `reset_key` varchar(20) DEFAULT NULL,
                          PRIMARY KEY (`id`),
                          UNIQUE KEY `UK_user_login` (`login`),
                          UNIQUE KEY `UK_user_email` (`email`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                        """,
                """
                        CREATE TABLE IF NOT EXISTS `jhi_user_authority` (
                          `user_id` bigint NOT NULL,
                          `authority_name` varchar(50) NOT NULL,
                          PRIMARY KEY (`user_id`,`authority_name`),
                          CONSTRAINT `FK_user` FOREIGN KEY (`user_id`) REFERENCES `jhi_user`(`id`),
                          CONSTRAINT `FK_authority` FOREIGN KEY (`authority_name`) REFERENCES `jhi_authority`(`name`)
                        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                        """
        );

        return runAndIntrospectSchema("userservice", sqls);
    }

    @PostMapping("/seed/userservice")
    public ResponseEntity<String> seedUserService() {
        // all of your INSERT ... ON DUPLICATE KEY UPDATE statements
        List<String> inserts = List.of(
                // 1) Seed jhi_authority
                """
                        INSERT INTO userservice.jhi_authority (name) VALUES
                          ('ROLE_ADMIN'),
                          ('ROLE_USER')
                        ON DUPLICATE KEY UPDATE name = name;
                        """,
                // 2) Seed jhi_user
                """
                        INSERT INTO userservice.jhi_user (
                          id, login, password_hash, first_name, last_name, email, image_url,
                          activated, lang_key, created_by, created_date, last_modified_by, last_modified_date
                        ) VALUES
                          (1, 'admin', '$2a$10$gSAhZrxMllrbgj/kkK9UceBPpChGWJA7SYIb1Mqo.n5aNLq1/oRrC',
                           'Administrator', 'Administrator', 'admin@localhost', NULL,
                           TRUE, 'en', 'system', '2025-02-28 12:00:00', 'system', '2025-02-28 12:00:00'),
                          (2, 'user',  '$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K',
                           'User',          'User',          'user@localhost',  NULL,
                           TRUE, 'en', 'system', '2025-02-28 12:00:00', 'system', '2025-02-28 12:00:00')
                        ON DUPLICATE KEY UPDATE login = VALUES(login);
                        """,
                // 3) Seed jhi_user_authority
                """
                        INSERT INTO userservice.jhi_user_authority (user_id, authority_name) VALUES
                          (1, 'ROLE_ADMIN'),
                          (1, 'ROLE_USER'),
                          (2, 'ROLE_USER')
                        ON DUPLICATE KEY UPDATE user_id = user_id;
                        """,
                // 4) Seed address
                """
                        INSERT INTO userservice.address
                          (id, user_id_1, street, city, state, country, postal_code) VALUES
                          (1, 1, 'Stoney Lane',     'Fort Pierce',   'pick uneven distinct', 'Albania', 'frizz gradient'),
                          (2, 2, 'E Franklin Street','Pembroke Pines','anti',               'Slovenia','whereas')
                        ON DUPLICATE KEY UPDATE id = id;
                        """
        );

        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);

            // execute all inserts
            try (Statement stmt = conn.createStatement()) {
                for (String sql : inserts) {
                    stmt.executeUpdate(sql);
                }
            }
            conn.commit();

            // now verify row counts
            Map<String, Integer> counts = new LinkedHashMap<>();
            try (Statement stmt = conn.createStatement()) {
                for (String table : List.of("jhi_authority", "jhi_user", "jhi_user_authority", "address")) {
                    try (ResultSet rs = stmt.executeQuery(
                            "SELECT COUNT(*) FROM userservice." + table)) {
                        if (rs.next()) {
                            counts.put(table, rs.getInt(1));
                        }
                    }
                }
            }

            String summary = counts.entrySet().stream()
                    .map(e -> e.getKey() + "=" + e.getValue())
                    .collect(Collectors.joining(", ", "Seed complete. Row counts: ", ""));

            return ResponseEntity.ok(summary);

        } catch (SQLException ex) {
            String err = "Error seeding userservice: " + ex.getMessage();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }


    private ResponseEntity<String> runAndIntrospectSchema(String schemaName, List<String> statements) {
        try (Connection conn = dataSource.getConnection()) {
            conn.setAutoCommit(false);

            // 1) Execute all DDL
            try (Statement stmt = conn.createStatement()) {
                for (String sql : statements) {
                    stmt.execute(sql);
                }
                // 2) explicit commit
                conn.commit();
            }

            // 3) Introspect via JDBC metadata
            DatabaseMetaData meta = conn.getMetaData();
            boolean foundSchema = false;
            List<String> tables = new ArrayList<>();

            // check if schema/database exists
            try (ResultSet cats = meta.getCatalogs()) {
                while (cats.next()) {
                    if (schemaName.equalsIgnoreCase(cats.getString("TABLE_CAT"))) {
                        foundSchema = true;
                        break;
                    }
                }
            }

            // list tables if schema exists
            if (foundSchema) {
                try (ResultSet rs = meta.getTables(schemaName, null, "%", new String[]{"TABLE"})) {
                    while (rs.next()) {
                        tables.add(rs.getString("TABLE_NAME"));
                    }
                }
            }

            String msg = String.format(
                    "Schema '%s' %s. Tables: %s",
                    schemaName,
                    foundSchema ? "exists" : "not found",
                    tables.isEmpty() ? "none" : String.join(", ", tables)
            );
            return ResponseEntity.ok(msg);

        } catch (SQLException ex) {
            String error = String.format("Error initializing '%s': %s", schemaName, ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}
