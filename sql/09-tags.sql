CREATE TABLE `tags`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `payment_plan_tags`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `payment_plan_id` int NOT NULL,
  `tag_id` int NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `deleted_at` TIMESTAMP NULL,
  PRIMARY KEY (`id`)
);

ALTER TABLE `payment_plan_tags` ADD CONSTRAINT `payment_tag_payment_id` FOREIGN KEY (`payment_plan_id`) REFERENCES `payment_plans` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `payment_plan_tags` ADD CONSTRAINT `payment_tag_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

/* INSERT INTO tags (name, slug) VALUES ('Shared', 'shared'); */
/* INSERT INTO payment_plan_tags (payment_plan_id, tag_id) SELECT id, 1 FROM payment_plans WHERE is_shared = TRUE; */
/* ALTER TABLE payment_plans DROP COLUMN is_shared; */
