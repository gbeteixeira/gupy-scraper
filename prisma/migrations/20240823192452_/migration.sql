-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_process_job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "requisites" TEXT NOT NULL DEFAULT '{}',
    "modality" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "publishDate" DATETIME,
    "img" TEXT,
    "match" INTEGER NOT NULL
);
INSERT INTO "new_process_job" ("company", "description", "id", "img", "link", "local", "match", "modality", "publishDate", "title") SELECT "company", "description", "id", "img", "link", "local", "match", "modality", "publishDate", "title" FROM "process_job";
DROP TABLE "process_job";
ALTER TABLE "new_process_job" RENAME TO "process_job";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
