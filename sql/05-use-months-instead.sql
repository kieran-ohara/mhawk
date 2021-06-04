ALTER TABLE `mhawk`.`payment_plans` ADD COLUMN `monthly_price` decimal(10, 2) NOT NULL AFTER `id`;

UPDATE payment_plans t1, payment_plans t2
SET t1.monthly_price = t1.total_price / (PERIOD_DIFF(
    EXTRACT(YEAR_MONTH FROM t1.end_date),
    EXTRACT(YEAR_MONTH FROM t1.start_date)
    ) +1)
WHERE t1.id = t2.id;

ALTER TABLE `mhawk`.`payment_plans` DROP COLUMN `total_price`;
