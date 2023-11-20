-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Day" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "firstHalfStartTime" INTEGER NOT NULL,
    "firstHalfEndTime" INTEGER,
    "secondHalfStartTime" INTEGER,
    "secondHalfEndTime" INTEGER NOT NULL,
    "courtId" INTEGER NOT NULL,
    CONSTRAINT "Day_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Day" ("courtId", "firstHalfEndTime", "firstHalfStartTime", "id", "name", "secondHalfEndTime", "secondHalfStartTime") SELECT "courtId", "firstHalfEndTime", "firstHalfStartTime", "id", "name", "secondHalfEndTime", "secondHalfStartTime" FROM "Day";
DROP TABLE "Day";
ALTER TABLE "new_Day" RENAME TO "Day";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
