/*
  Warnings:

  - You are about to drop the column `appointmentDate` on the `appointments` table. All the data in the column will be lost.
  - You are about to drop the column `appointmentTime` on the `appointments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[doctorId,appointmentAt]` on the table `appointments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `appointmentAt` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "appointments_doctorId_appointmentDate_idx";

-- AlterTable
ALTER TABLE "appointments" DROP COLUMN "appointmentDate",
DROP COLUMN "appointmentTime",
ADD COLUMN     "appointmentAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "appointments_doctorId_appointmentAt_key" ON "appointments"("doctorId", "appointmentAt");
