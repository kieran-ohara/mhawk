CREATE TABLE `payment_plan_attachments`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `payment_plan_id` int NOT NULL,
  `uri` varchar(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`),
  INDEX `attachment_to_payment_plan`(`payment_plan_id`) USING BTREE
);

ALTER TABLE `payment_plan_attachments` ADD CONSTRAINT `fk_payment_plan_attachments_payment_plans_1` FOREIGN KEY (`payment_plan_id`) REFERENCES `payment_plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
