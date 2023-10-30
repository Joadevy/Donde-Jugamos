/*
  Warnings:

  - You are about to alter the column `endTime` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `startTime` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `firstHalfEndTime` on the `Day` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `firstHalfStartTime` on the `Day` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `secondHalfEndTime` on the `Day` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to alter the column `secondHalfStartTime` on the `Day` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "startTime" INTEGER NOT NULL,
    "endTime" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "courtId" INTEGER NOT NULL,
    "dayId" INTEGER NOT NULL,
    CONSTRAINT "Appointment_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Appointment" ("active", "courtId", "date", "dayId", "endTime", "id", "startTime") SELECT "active", "courtId", "date", "dayId", "endTime", "id", "startTime" FROM "Appointment";
DROP TABLE "Appointment";
ALTER TABLE "new_Appointment" RENAME TO "Appointment";
CREATE TABLE "new_Day" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "firstHalfStartTime" INTEGER NOT NULL,
    "firstHalfEndTime" INTEGER NOT NULL,
    "secondHalfStartTime" INTEGER NOT NULL,
    "secondHalfEndTime" INTEGER NOT NULL,
    "sportCenterId" INTEGER NOT NULL,
    CONSTRAINT "Day_sportCenterId_fkey" FOREIGN KEY ("sportCenterId") REFERENCES "SportCenter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Day" ("firstHalfEndTime", "firstHalfStartTime", "id", "name", "secondHalfEndTime", "secondHalfStartTime", "sportCenterId") SELECT "firstHalfEndTime", "firstHalfStartTime", "id", "name", "secondHalfEndTime", "secondHalfStartTime", "sportCenterId" FROM "Day";
DROP TABLE "Day";
ALTER TABLE "new_Day" RENAME TO "Day";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
