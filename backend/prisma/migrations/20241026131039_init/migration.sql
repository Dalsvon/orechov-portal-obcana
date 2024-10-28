/*
  Warnings:

  - Added the required column `fromWebsite` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "fromWebsite" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "organization" (
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

    CONSTRAINT "organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfficeHours" (
    "id" SERIAL NOT NULL,
    "days" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "contactId" INTEGER NOT NULL,

    CONSTRAINT "OfficeHours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "contactId" INTEGER NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OfficeHours" ADD CONSTRAINT "OfficeHours_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
