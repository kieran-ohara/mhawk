ALTER TABLE `mhawk`.`payment_plans` ADD COLUMN `deleted_at` TIMESTAMP NULL AFTER `updated_at`;

ALTER TABLE `mhawk`.`payment_plan_payments` ADD COLUMN `deleted_at` TIMESTAMP NULL AFTER `updated_at`;
