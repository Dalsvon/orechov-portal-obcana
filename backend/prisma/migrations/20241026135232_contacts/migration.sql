/*
  Warnings:

  - You are about to drop the `organization` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OfficeHours" DROP CONSTRAINT "OfficeHours_contactId_fkey";

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_contactId_fkey";

-- DropTable
DROP TABLE "organization";

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "mobile" TEXT,
    "email" TEXT,
    "maintenence" TEXT,
    "data_id" TEXT,
    "ic" TEXT,
    "dic" TEXT,
    "bank_account" TEXT,
    "last_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OfficeHours" ADD CONSTRAINT "OfficeHours_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
