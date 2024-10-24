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
    `url` VARCHAR(191) NOT NULL,
    `nickname` VARCHAR(191) NOT NULL DEFAULT '',
    `refreshToken` VARCHAR(191) NOT NULL,
    `refreshTokenTime` DATETIME(3) NOT NULL,
    `openToken` VARCHAR(191) NOT NULL,
    `openTokenTime` DATETIME(3) NOT NULL,
    `openAccessToken` VARCHAR(191) NOT NULL,
    `openAccessTokenTime` DATETIME(3) NOT NULL,

    INDEX `Ali_url_fkey`(`url`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Ali` ADD CONSTRAINT `Ali_url_fkey` FOREIGN KEY (`url`) REFERENCES `Tvbox`(`url`) ON DELETE RESTRICT ON UPDATE CASCADE;
