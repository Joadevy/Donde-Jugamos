-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SportCenter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "CBU" TEXT,
    "Alias" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "state" TEXT NOT NULL DEFAULT 'pending',
    "cancelTimeLimit" INTEGER NOT NULL DEFAULT 180,
    "paymentTimeLimit" INTEGER NOT NULL DEFAULT 180,
    "userId" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    "acceptPartialPayment" BOOLEAN NOT NULL DEFAULT true,
    "partialPaymentPercentage" INTEGER NOT NULL DEFAULT 30,
    CONSTRAINT "SportCenter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SportCenter_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SportCenter" ("Alias", "CBU", "acceptPartialPayment", "active", "address", "cancelTimeLimit", "cityId", "description", "email", "id", "name", "partialPaymentPercentage", "paymentTimeLimit", "phone", "state", "userId") SELECT "Alias", "CBU", "acceptPartialPayment", "active", "address", "cancelTimeLimit", "cityId", "description", "email", "id", "name", "partialPaymentPercentage", "paymentTimeLimit", "phone", coalesce("state", 'pending') AS "state", "userId" FROM "SportCenter";
DROP TABLE "SportCenter";
ALTER TABLE "new_SportCenter" RENAME TO "SportCenter";
CREATE UNIQUE INDEX "SportCenter_CBU_key" ON "SportCenter"("CBU");
CREATE UNIQUE INDEX "SportCenter_Alias_key" ON "SportCenter"("Alias");
CREATE UNIQUE INDEX "SportCenter_userId_key" ON "SportCenter"("userId");
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "registerDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "CBU" TEXT,
    "Alias" TEXT
);
INSERT INTO "new_User" ("Alias", "CBU", "email", "emailVerified", "id", "image", "name", "registerDate", "role") SELECT "Alias", "CBU", "email", "emailVerified", "id", "image", "name", "registerDate", coalesce("role", 'customer') AS "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_CBU_key" ON "User"("CBU");
CREATE UNIQUE INDEX "User_Alias_key" ON "User"("Alias");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
