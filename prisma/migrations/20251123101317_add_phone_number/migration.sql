/*
  Warnings:

  - Made the column `senderEmail` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderName" TEXT,
    "senderEmail" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "content" TEXT NOT NULL,
    "reply" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paintingId" INTEGER,
    CONSTRAINT "Message_paintingId_fkey" FOREIGN KEY ("paintingId") REFERENCES "Painting" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("content", "createdAt", "id", "paintingId", "reply", "senderEmail", "senderName") SELECT "content", "createdAt", "id", "paintingId", "reply", "senderEmail", "senderName" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
