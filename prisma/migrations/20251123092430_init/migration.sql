-- CreateTable
CREATE TABLE "Painting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "senderName" TEXT,
    "senderEmail" TEXT,
    "content" TEXT NOT NULL,
    "reply" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paintingId" INTEGER,
    CONSTRAINT "Message_paintingId_fkey" FOREIGN KEY ("paintingId") REFERENCES "Painting" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
