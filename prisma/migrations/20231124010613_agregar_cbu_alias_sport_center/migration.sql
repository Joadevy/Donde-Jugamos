/*
  Warnings:

  - A unique constraint covering the columns `[CBU]` on the table `SportCenter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[Alias]` on the table `SportCenter` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SportCenter" ADD COLUMN "Alias" TEXT;
ALTER TABLE "SportCenter" ADD COLUMN "CBU" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SportCenter_CBU_key" ON "SportCenter"("CBU");

-- CreateIndex
CREATE UNIQUE INDEX "SportCenter_Alias_key" ON "SportCenter"("Alias");
