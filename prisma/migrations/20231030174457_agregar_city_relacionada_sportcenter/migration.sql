/*
  Warnings:

  - You are about to drop the column `location` on the `SportCenter` table. All the data in the column will be lost.
  - You are about to drop the column `postcode` on the `SportCenter` table. All the data in the column will be lost.
  - Added the required column `address` to the `SportCenter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityId` to the `SportCenter` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "postCode" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SportCenter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "cancelTimeLimit" INTEGER NOT NULL DEFAULT 180,
    "paymentTimeLimit" INTEGER NOT NULL DEFAULT 180,
    "userId" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    CONSTRAINT "SportCenter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SportCenter_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SportCenter" ("active", "cancelTimeLimit", "description", "email", "id", "name", "paymentTimeLimit", "phone", "userId") SELECT "active", "cancelTimeLimit", "description", "email", "id", "name", "paymentTimeLimit", "phone", "userId" FROM "SportCenter";
DROP TABLE "SportCenter";
ALTER TABLE "new_SportCenter" RENAME TO "SportCenter";
CREATE UNIQUE INDEX "SportCenter_userId_key" ON "SportCenter"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
