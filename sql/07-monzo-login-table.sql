CREATE TABLE `mhawk`.`monzo_login`  (
    `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
    `access_token` varchar(255) NOT NULL,
    `client_id` varchar(255) NOT NULL,
    `expires_in` int UNSIGNED NOT NULL,
    `refresh_token` varchar(255) NOT NULL,
    `scope` varchar(255) NOT NULL,
    `token_type` varchar(255) NOT NULL,
    `user_id` varchar(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE INDEX `uniq_monzologin_user_id`(`user_id`)
);
