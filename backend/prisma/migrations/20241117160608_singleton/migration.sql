/*
  Warnings:

  - You are about to drop the column `bank_account` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `data_id` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `last_updated` on the `contact` table. All the data in the column will be lost.
  - Added the required column `lastUpdated` to the `contact` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `contactId` on the `employees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `contactId` on the `office_hours` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_contactId_fkey";

-- DropForeignKey
ALTER TABLE "office_hours" DROP CONSTRAINT "office_hours_contactId_fkey";

-- DropIndex
DROP INDEX "contact_createdAt_key";

-- AlterTable
ALTER TABLE "contact" DROP COLUMN "bank_account",
DROP COLUMN "data_id",
DROP COLUMN "last_updated",
ADD COLUMN     "bankAccount" TEXT,
ADD COLUMN     "dataId" TEXT,
ADD COLUMN     "id" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "lastUpdated" TIMESTAMP(3) NOT NULL,
ADD CONSTRAINT "contact_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "contactId",
ADD COLUMN     "contactId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "office_hours" DROP COLUMN "contactId",
ADD COLUMN     "contactId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "office_hours" ADD CONSTRAINT "office_hours_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE CASCADE ON UPDATE CASCADE;
