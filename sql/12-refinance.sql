ALTER TABLE `mhawk`.`payment_plans` ADD COLUMN `refinance_payment_plan_id` int NULL AFTER `reference`;
ALTER TABLE `mhawk`.`payment_plans` ADD CONSTRAINT `payment_plan_payment_to_refinance_payment_plan` FOREIGN KEY (`refinance_payment_plan_id`) REFERENCES `payment_plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
