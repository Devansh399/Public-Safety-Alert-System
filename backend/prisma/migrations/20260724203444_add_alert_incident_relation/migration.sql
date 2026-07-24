/*
  Warnings:

  - A unique constraint covering the columns `[incidentId]` on the table `Alert` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `incidentId` to the `Alert` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `alert` ADD COLUMN `incidentId` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Alert_incidentId_key` ON `Alert`(`incidentId`);

-- AddForeignKey
ALTER TABLE `Alert` ADD CONSTRAINT `Alert_incidentId_fkey` FOREIGN KEY (`incidentId`) REFERENCES `IncidentReport`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
