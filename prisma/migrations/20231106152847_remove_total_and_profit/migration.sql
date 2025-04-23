/*
  Warnings:

  - You are about to drop the column `profit` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Appointment` table. All the data in the column will be lost.
  - Made the column `eventId` on table `Appointment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Appointment` DROP COLUMN `profit`,
    DROP COLUMN `total`,
    MODIFY `eventId` VARCHAR(191) NOT NULL;
