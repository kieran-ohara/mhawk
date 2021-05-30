ALTER TABLE `mhawk`.`payment_plan_payments` ADD UNIQUE INDEX `idx_dedupe`(`dedupe_id`) USING BTREE;
