/*
  Warnings:

  - Added the required column `jobId` to the `process_job` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_process_job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "requisites" TEXT NOT NULL DEFAULT '{}',
    "modality" TEXT,
    "link" TEXT NOT NULL,
    "publishDate" DATETIME,
    "img" TEXT,
    "match" INTEGER NOT NULL
);
INSERT INTO "new_process_job" ("company", "description", "id", "img", "link", "local", "match", "modality", "publishDate", "requisites", "title") SELECT "company", "description", "id", "img", "link", "local", "match", "modality", "publishDate", "requisites", "title" FROM "process_job";
DROP TABLE "process_job";
ALTER TABLE "new_process_job" RENAME TO "process_job";
CREATE UNIQUE INDEX "process_job_jobId_key" ON "process_job"("jobId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
