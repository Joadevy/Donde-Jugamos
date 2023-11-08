/*
  Warnings:

  - A unique constraint covering the columns `[postCode]` on the table `City` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "City_postCode_key" ON "City"("postCode");
