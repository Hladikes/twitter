-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tweet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "authorId" INTEGER NOT NULL,
    "parentId" INTEGER,
    CONSTRAINT "Tweet_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tweet_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Tweet" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Tweet" ("authorId", "content", "id", "parentId") SELECT "authorId", "content", "id", "parentId" FROM "Tweet";
DROP TABLE "Tweet";
ALTER TABLE "new_Tweet" RENAME TO "Tweet";
CREATE UNIQUE INDEX "Tweet_parentId_key" ON "Tweet"("parentId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
