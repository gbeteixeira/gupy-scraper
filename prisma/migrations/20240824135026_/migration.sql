/*
  Warnings:

  - Added the required column `jobId` to the `job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platform` to the `job` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jobId" INTEGER NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "companyId" INTEGER NOT NULL,
    "companyLogo" TEXT,
    "companyName" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "hardSkills" TEXT,
    "education" TEXT,
    "seniority" TEXT,
    "platform" TEXT NOT NULL,
    "contractType" TEXT NOT NULL DEFAULT 'not informed',
    "jobUrl" TEXT NOT NULL,
    "workplaceType" TEXT NOT NULL,
    "currentState" TEXT,
    "publishedDate" DATETIME NOT NULL,
    "applicationDeadline" DATETIME
);
INSERT INTO "new_job" ("applicationDeadline", "city", "companyId", "companyLogo", "companyName", "contractType", "country", "currentState", "description", "education", "hardSkills", "id", "jobUrl", "publishedDate", "seniority", "state", "title", "workplaceType") SELECT "applicationDeadline", "city", "companyId", "companyLogo", "companyName", "contractType", "country", "currentState", "description", "education", "hardSkills", "id", "jobUrl", "publishedDate", "seniority", "state", "title", "workplaceType" FROM "job";
DROP TABLE "job";
ALTER TABLE "new_job" RENAME TO "job";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
