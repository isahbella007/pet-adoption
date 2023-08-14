/*
  Warnings:

  - You are about to drop the column `user_id` on the `pet_images` table. All the data in the column will be lost.
  - Made the column `pet_image_id` on table `pet_images` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `pet_images` DROP FOREIGN KEY `Pet_Images_user_id_fkey`;

-- AlterTable
ALTER TABLE `pet_images` DROP COLUMN `user_id`,
    MODIFY `pet_image_id` VARCHAR(191) NOT NULL;
