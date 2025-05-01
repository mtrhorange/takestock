// src/main/java/com/example/demo/DbInitController.java
package com.ecommerce.order.web.rest;

import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/db")
public class DbInitController {

    private final JdbcTemplate jdbc;

    public DbInitController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @PostMapping("/orderservice")
    public ResponseEntity<String> initOrderService() {
        try {
            // 1) Create the orderservice database
            jdbc.execute("""
                      CREATE DATABASE IF NOT EXISTS `orderservice`
                        /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */
                        /*!80016 DEFAULT ENCRYPTION='N' */;
                    """);

            // 2) Use it
            jdbc.execute("USE `orderservice`;");

            // 3) Create tables
            jdbc.execute("""
                      CREATE TABLE IF NOT EXISTS `jhi_order` (
                        `id` bigint NOT NULL AUTO_INCREMENT,
                        `created_date` datetime(6) DEFAULT NULL,
                        `order_status` varchar(255) NOT NULL,
                        `payment_status` varchar(255) NOT NULL,
                        `total_price` decimal(21,2) NOT NULL,
                        `user_id_1` bigint NOT NULL,
                        PRIMARY KEY (`id`)
                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                    """);

            jdbc.execute("""
                      CREATE TABLE IF NOT EXISTS `order_item` (
                        `id` bigint NOT NULL AUTO_INCREMENT,
                        `price` decimal(21,2) NOT NULL,
                        `product_id` varchar(255) NOT NULL,
                        `quantity` int NOT NULL,
                        `order_id` bigint DEFAULT NULL,
                        PRIMARY KEY (`id`),
                        KEY `FK_order` (`order_id`),
                        CONSTRAINT `FK_order` FOREIGN KEY (`order_id`) REFERENCES `jhi_order` (`id`)
                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                    """);

            jdbc.execute("""
                      CREATE TABLE IF NOT EXISTS `payment` (
                        `id` bigint NOT NULL AUTO_INCREMENT,
                        `payment_date` datetime(6) NOT NULL,
                        `payment_method` varchar(255) NOT NULL,
                        `payment_status` varchar(255) NOT NULL,
                        `transaction_id` varchar(255) NOT NULL,
                        `order_id` bigint DEFAULT NULL,
                        PRIMARY KEY (`id`),
                        UNIQUE KEY `UK_payment_order` (`order_id`),
                        CONSTRAINT `FK_payment_order` FOREIGN KEY (`order_id`) REFERENCES `jhi_order` (`id`)
                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                    """);

            return ResponseEntity.ok("orderservice schema created");
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body("Error initializing orderservice: " + e.getMessage());
        }
    }

    @PostMapping("/userservice")
    public ResponseEntity<String> initUserService() {
        try {
            // 1) Create the userservice database
            jdbc.execute("""
                      CREATE DATABASE IF NOT EXISTS `userservice`
                        /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */
                        /*!80016 DEFAULT ENCRYPTION='N' */;
                    """);

            // 2) Use it
            jdbc.execute("USE `userservice`;");

            // 3) Create tables
            jdbc.execute("""
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
                    """);

            jdbc.execute("""
                      CREATE TABLE IF NOT EXISTS `jhi_authority` (
                        `name` varchar(50) NOT NULL,
                        PRIMARY KEY (`name`)
                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                    """);

            jdbc.execute("""
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
                    """);

            jdbc.execute("""
                      CREATE TABLE IF NOT EXISTS `jhi_user_authority` (
                        `user_id` bigint NOT NULL,
                        `authority_name` varchar(50) NOT NULL,
                        PRIMARY KEY (`user_id`,`authority_name`),
                        CONSTRAINT `FK_user` FOREIGN KEY (`user_id`) REFERENCES `jhi_user` (`id`),
                        CONSTRAINT `FK_authority` FOREIGN KEY (`authority_name`) REFERENCES `jhi_authority` (`name`)
                      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
                    """);

            return ResponseEntity.ok("userservice schema created");
        } catch (Exception e) {
            return ResponseEntity
                    .status(500)
                    .body("Error initializing userservice: " + e.getMessage());
        }
    }
}
