/*
  Warnings:

  - Added the required column `pet_type` to the `Pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pets` ADD COLUMN `pet_type` VARCHAR(191) NOT NULL;
