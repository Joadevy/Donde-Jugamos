/*
  Warnings:

  - You are about to drop the `_CourtToDay` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courtId` to the `Day` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_CourtToDay_B_index";

-- DropIndex
DROP INDEX "_CourtToDay_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_CourtToDay";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Day" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "firstHalfStartTime" INTEGER NOT NULL,
    "firstHalfEndTime" INTEGER NOT NULL,
    "secondHalfStartTime" INTEGER NOT NULL,
    "secondHalfEndTime" INTEGER NOT NULL,
    "courtId" INTEGER NOT NULL,
    CONSTRAINT "Day_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Day" ("firstHalfEndTime", "firstHalfStartTime", "id", "name", "secondHalfEndTime", "secondHalfStartTime") SELECT "firstHalfEndTime", "firstHalfStartTime", "id", "name", "secondHalfEndTime", "secondHalfStartTime" FROM "Day";
DROP TABLE "Day";
ALTER TABLE "new_Day" RENAME TO "Day";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
