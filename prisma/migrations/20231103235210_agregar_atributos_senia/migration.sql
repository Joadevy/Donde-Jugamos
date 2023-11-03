/*
  Warnings:

  - You are about to alter the column `price` on the `Court` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `partialPayment` on the `Reservation` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Court" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "capacity" INTEGER NOT NULL,
    "price" REAL NOT NULL,
    "description" TEXT,
    "sportCenterId" INTEGER NOT NULL,
    "sportId" INTEGER NOT NULL,
    CONSTRAINT "Court_sportCenterId_fkey" FOREIGN KEY ("sportCenterId") REFERENCES "SportCenter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Court_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Court" ("capacity", "description", "id", "price", "sportCenterId", "sportId") SELECT "capacity", "description", "id", "price", "sportCenterId", "sportId" FROM "Court";
DROP TABLE "Court";
ALTER TABLE "new_Court" RENAME TO "Court";
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
    "acceptPartialPayment" BOOLEAN NOT NULL DEFAULT true,
    "partialPaymentPercentage" INTEGER NOT NULL DEFAULT 30,
    CONSTRAINT "SportCenter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SportCenter_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SportCenter" ("active", "address", "cancelTimeLimit", "cityId", "description", "email", "id", "name", "paymentTimeLimit", "phone", "userId") SELECT "active", "address", "cancelTimeLimit", "cityId", "description", "email", "id", "name", "paymentTimeLimit", "phone", "userId" FROM "SportCenter";
DROP TABLE "SportCenter";
ALTER TABLE "new_SportCenter" RENAME TO "SportCenter";
CREATE UNIQUE INDEX "SportCenter_userId_key" ON "SportCenter"("userId");
CREATE TABLE "new_Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" TEXT DEFAULT 'pending',
    "observation" TEXT,
    "partialPayment" REAL,
    "paymentConfirmation" TEXT,
    "appointmentId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Reservation_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("appointmentId", "date", "id", "observation", "partialPayment", "paymentConfirmation", "state", "userId") SELECT "appointmentId", "date", "id", "observation", "partialPayment", "paymentConfirmation", "state", "userId" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
