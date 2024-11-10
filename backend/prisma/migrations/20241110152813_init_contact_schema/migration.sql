/*
  Warnings:

  - The primary key for the `contact` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the `OfficeHours` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[createdAt]` on the table `contact` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `contactId` on the `employees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "OfficeHours" DROP CONSTRAINT "OfficeHours_contactId_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_contactId_fkey";

-- AlterTable
ALTER TABLE "contact" DROP CONSTRAINT "contact_pkey",
DROP COLUMN "id";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "contactId",
ADD COLUMN     "contactId" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "OfficeHours";

-- CreateTable
CREATE TABLE "office_hours" (
    "id" SERIAL NOT NULL,
    "days" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "contactId" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "office_hours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contact_createdAt_key" ON "contact"("createdAt");

-- AddForeignKey
ALTER TABLE "office_hours" ADD CONSTRAINT "office_hours_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("createdAt") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("createdAt") ON DELETE CASCADE ON UPDATE CASCADE;
