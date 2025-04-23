-- CreateTable
CREATE TABLE `Appointment` (
    `id` VARCHAR(191) NOT NULL,
    `appointmentStart` VARCHAR(191) NOT NULL,
    `appointmentEnd` VARCHAR(191) NOT NULL,
    `client` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `jewels` VARCHAR(191) NOT NULL,
    `place` VARCHAR(191) NOT NULL,
    `rate` VARCHAR(191) NOT NULL,
    `service` VARCHAR(191) NOT NULL,
    `total` VARCHAR(191) NOT NULL,
    `profit` VARCHAR(191) NOT NULL,
    `completed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
