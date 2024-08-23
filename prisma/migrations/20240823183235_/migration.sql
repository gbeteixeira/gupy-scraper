/*
  Warnings:

  - The primary key for the `process_job` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `process_job` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_process_job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "modality" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "publishDate" DATETIME,
    "img" TEXT NOT NULL,
    "match" INTEGER NOT NULL
);
INSERT INTO "new_process_job" ("company", "description", "id", "img", "link", "local", "match", "modality", "publishDate", "title") SELECT "company", "description", "id", "img", "link", "local", "match", "modality", "publishDate", "title" FROM "process_job";
DROP TABLE "process_job";
ALTER TABLE "new_process_job" RENAME TO "process_job";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
