-- Adminer 4.7.7 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

USE `stock`;

DROP TABLE IF EXISTS `stock`;
CREATE TABLE `stock` (
  `stock_id` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `stock_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`stock_id`),
  KEY `stock_id` (`stock_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `stock` (`stock_id`, `stock_name`) VALUES
('2330',	'台積電'),
('2603',	'長榮'),
('2618',	'長榮航');

DROP TABLE IF EXISTS `stock_price`;
CREATE TABLE `stock_price` (
  `stock_id` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `open_price` decimal(10,2) unsigned NOT NULL,
  `high_price` decimal(10,2) unsigned NOT NULL,
  `low_price` decimal(10,2) unsigned NOT NULL,
  `close_price` decimal(10,2) unsigned NOT NULL,
  `delta_price` decimal(10,2) NOT NULL,
  `transactions` int(10) unsigned NOT NULL,
  `volume` bigint(20) unsigned NOT NULL,
  `amount` decimal(14,2) unsigned NOT NULL,
  PRIMARY KEY (`stock_id`,`date`),
  CONSTRAINT `stock_price_ibfk_1` FOREIGN KEY (`stock_id`) REFERENCES `stock` (`stock_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2021-08-08 06:05:21
