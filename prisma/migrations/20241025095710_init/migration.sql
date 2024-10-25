-- CreateTable
CREATE TABLE `Tvbox` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tvbox_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ali` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nickname` VARCHAR(191) NOT NULL DEFAULT '',
    `refreshToken` VARCHAR(191) NOT NULL,
    `refreshTokenTime` DATETIME(3) NOT NULL,
    `openToken` VARCHAR(512) NOT NULL,
    `openTokenTime` DATETIME(3) NOT NULL,
    `openAccessToken` VARCHAR(512) NOT NULL,
    `openAccessTokenTime` DATETIME(3) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Ali_refreshToken_key`(`refreshToken`),
    UNIQUE INDEX `Ali_openToken_key`(`openToken`),
    UNIQUE INDEX `Ali_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Setting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `alist_restart_required` VARCHAR(191) NOT NULL,
    `app_version` VARCHAR(191) NOT NULL,
    `alist_password` VARCHAR(191) NOT NULL,
    `fix_site_id` VARCHAR(191) NOT NULL,
    `ali_secret` VARCHAR(191) NOT NULL,
    `alist_start_time` DATETIME(3) NOT NULL,
    `alist_username` VARCHAR(191) NOT NULL,
    `fix_sub_id` VARCHAR(191) NOT NULL,
    `auto_index` VARCHAR(191) NOT NULL,
    `docker_version` VARCHAR(191) NOT NULL,
    `atv_password` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `index_version` VARCHAR(191) NOT NULL,
    `fix_sid` VARCHAR(191) NOT NULL,
    `auto_index_version` VARCHAR(191) NOT NULL,
    `refresh_token_time` DATETIME(3) NOT NULL,
    `movie_version` VARCHAR(191) NOT NULL,
    `alist_login` VARCHAR(191) NOT NULL,
    `fix_meta_id` VARCHAR(191) NOT NULL,
    `open_token_url` VARCHAR(191) NOT NULL,
    `fix_navigation` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Setting_url_key`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ali` ADD CONSTRAINT `Ali_url_fkey` FOREIGN KEY (`url`) REFERENCES `Tvbox`(`url`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Setting` ADD CONSTRAINT `Setting_url_fkey` FOREIGN KEY (`url`) REFERENCES `Tvbox`(`url`) ON DELETE RESTRICT ON UPDATE CASCADE;
