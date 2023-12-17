-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_City" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "postCode" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_City" ("active", "id", "name", "postCode") SELECT "active", "id", "name", "postCode" FROM "City";
DROP TABLE "City";
ALTER TABLE "new_City" RENAME TO "City";
CREATE UNIQUE INDEX "City_postCode_key" ON "City"("postCode");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
