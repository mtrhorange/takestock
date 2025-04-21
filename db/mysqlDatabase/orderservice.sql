CREATE DATABASE `orderservice` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

CREATE TABLE `jhi_order` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_date` datetime(6) DEFAULT NULL,
  `order_status` varchar(255) NOT NULL,
  `payment_status` varchar(255) NOT NULL,
  `total_price` decimal(21,2) NOT NULL,
  `user_id_1` bigint NOT NULL,d
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `order_item` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `price` decimal(21,2) NOT NULL,
  `product_id` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKk13je588x5ainnttuyk63dt90` (`order_id`),
  CONSTRAINT `FKk13je588x5ainnttuyk63dt90` FOREIGN KEY (`order_id`) REFERENCES `jhi_order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `payment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `payment_date` datetime(6) NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `payment_status` varchar(255) NOT NULL,
  `transaction_id` varchar(255) NOT NULL,
  `order_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_mf7n8wo2rwrxsd6f3t9ub2mep` (`order_id`),
  CONSTRAINT `FKd4v1fttvxg0qmd0bkjvaqgirq` FOREIGN KEY (`order_id`) REFERENCES `jhi_order` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
