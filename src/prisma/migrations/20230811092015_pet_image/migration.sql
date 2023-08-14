/*
  Warnings:

  - You are about to drop the column `height` on the `pets` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `pets` DROP COLUMN `height`;

-- CreateTable
CREATE TABLE `Pet_Images` (
    `id` VARCHAR(191) NOT NULL,
    `pet_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `pet_image_id` VARCHAR(191) NULL,

    UNIQUE INDEX `Pet_Images_id_key`(`id`),
    UNIQUE INDEX `Pet_Images_pet_id_key`(`pet_id`),
    UNIQUE INDEX `Pet_Images_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pet_Images` ADD CONSTRAINT `Pet_Images_pet_id_fkey` FOREIGN KEY (`pet_id`) REFERENCES `Pets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pet_Images` ADD CONSTRAINT `Pet_Images_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
