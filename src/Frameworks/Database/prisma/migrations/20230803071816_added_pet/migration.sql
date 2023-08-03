-- AlterTable
ALTER TABLE `user` MODIFY `image_public_id` VARCHAR(191) NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `Address` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `LGA` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `home_address` VARCHAR(191) NULL,

    UNIQUE INDEX `Address_id_key`(`id`),
    UNIQUE INDEX `Address_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pets` (
    `id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `breed` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `height` VARCHAR(191) NOT NULL,
    `size` VARCHAR(191) NOT NULL,
    `gender` VARCHAR(191) NOT NULL,
    `coat_length` VARCHAR(191) NOT NULL,
    `urgent_adoption` BOOLEAN NOT NULL DEFAULT false,
    `fee` VARCHAR(191) NULL,
    `flag` VARCHAR(191) NOT NULL DEFAULT 'PENDING',

    UNIQUE INDEX `Pets_id_key`(`id`),
    UNIQUE INDEX `Pets_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Good_With` (
    `id` VARCHAR(191) NOT NULL,
    `pet_id` VARCHAR(191) NOT NULL,
    `good_with` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Good_With_id_key`(`id`),
    UNIQUE INDEX `Good_With_pet_id_key`(`pet_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pet_Behaviour` (
    `id` VARCHAR(191) NOT NULL,
    `pet_id` VARCHAR(191) NOT NULL,
    `behaviour` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Pet_Behaviour_id_key`(`id`),
    UNIQUE INDEX `Pet_Behaviour_pet_id_key`(`pet_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pet_Address` (
    `id` VARCHAR(191) NOT NULL,
    `pet_id` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NOT NULL,
    `LGA` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Pet_Address_id_key`(`id`),
    UNIQUE INDEX `Pet_Address_pet_id_key`(`pet_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pets` ADD CONSTRAINT `Pets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Good_With` ADD CONSTRAINT `Good_With_pet_id_fkey` FOREIGN KEY (`pet_id`) REFERENCES `Pets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pet_Behaviour` ADD CONSTRAINT `Pet_Behaviour_pet_id_fkey` FOREIGN KEY (`pet_id`) REFERENCES `Pets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pet_Address` ADD CONSTRAINT `Pet_Address_pet_id_fkey` FOREIGN KEY (`pet_id`) REFERENCES `Pets`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
