/*
  Warnings:

  - You are about to alter the column `size` on the `pets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `fee` on the `pets` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `pets` MODIFY `size` INTEGER NOT NULL,
    MODIFY `fee` INTEGER NULL;
