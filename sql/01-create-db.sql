CREATE TABLE `payment_plan_payments`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime(0) NOT NULL,
  `dedupe_id` varchar(255) NOT NULL,
  `amount` decimal(10, 2) NOT NULL,
  `payment_plan_id` int NOT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `payment_plans`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `total_price` decimal(10, 2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `reference` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
);

ALTER TABLE `payment_plan_payments` ADD CONSTRAINT `payment_plan_payment_to_payment_plan` FOREIGN KEY (`payment_plan_id`) REFERENCES `payment_plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;


