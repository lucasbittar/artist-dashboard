/*
  Warnings:

  - Added the required column `profit` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Appointment` ADD COLUMN `profit` VARCHAR(191) NOT NULL,
    ADD COLUMN `total` VARCHAR(191) NOT NULL;
