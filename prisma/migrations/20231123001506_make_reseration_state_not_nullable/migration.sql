-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "state" TEXT NOT NULL DEFAULT 'pending',
    "observation" TEXT,
    "partialPayment" REAL,
    "paymentConfirmation" TEXT,
    "appointmentId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Reservation_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Reservation" ("appointmentId", "date", "id", "observation", "partialPayment", "paymentConfirmation", "state", "userId") SELECT "appointmentId", "date", "id", "observation", "partialPayment", "paymentConfirmation", coalesce("state", 'pending') AS "state", "userId" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
