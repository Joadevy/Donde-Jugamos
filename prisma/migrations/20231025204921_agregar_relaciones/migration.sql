-- CreateTable
CREATE TABLE "SportCenter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "cancelTimeLimit" INTEGER NOT NULL DEFAULT 180,
    "paymentTimeLimit" INTEGER NOT NULL DEFAULT 180,
    "userId" TEXT NOT NULL,
    CONSTRAINT "SportCenter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Court" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "capacity" INTEGER NOT NULL,
    "price" DECIMAL NOT NULL,
    "description" TEXT,
    "sportCenterId" INTEGER NOT NULL,
    "sportId" INTEGER NOT NULL,
    CONSTRAINT "Court_sportCenterId_fkey" FOREIGN KEY ("sportCenterId") REFERENCES "SportCenter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Court_sportId_fkey" FOREIGN KEY ("sportId") REFERENCES "Sport" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "startTime" REAL NOT NULL,
    "endTime" REAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "courtId" INTEGER NOT NULL,
    "dayId" INTEGER NOT NULL,
    CONSTRAINT "Appointment_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "Court" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Appointment_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "Day" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "date" DATETIME NOT NULL,
    "state" TEXT DEFAULT 'pending',
    "observation" TEXT,
    "partialPayment" DECIMAL NOT NULL,
    "paymentConfirmation" BLOB,
    "appointmentId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Reservation_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Sport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL DEFAULT 60
);

-- CreateTable
CREATE TABLE "Day" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "firstHalfStartTime" REAL NOT NULL,
    "firstHalfEndTime" REAL NOT NULL,
    "secondHalfStartTime" REAL NOT NULL,
    "secondHalfEndTime" REAL NOT NULL,
    "sportCenterId" INTEGER NOT NULL,
    CONSTRAINT "Day_sportCenterId_fkey" FOREIGN KEY ("sportCenterId") REFERENCES "SportCenter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SportCenter_userId_key" ON "SportCenter"("userId");
