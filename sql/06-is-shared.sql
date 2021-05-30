ALTER TABLE `mhawk`.`payment_plans` ADD COLUMN `is_shared` tinyint NOT NULL DEFAULT 0 AFTER `reference`;
