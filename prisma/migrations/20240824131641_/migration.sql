/*
  Warnings:

  - You are about to drop the column `serviceName` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `job` table. All the data in the column will be lost.
  - Made the column `workplaceType` on table `job` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT,
    "description" TEXT,
    "companyId" INTEGER NOT NULL,
    "companyLogo" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "hardSkills" TEXT NOT NULL,
    "education" TEXT NOT NULL,
    "seniority" TEXT NOT NULL,
    "contractType" TEXT NOT NULL,
    "jobUrl" TEXT NOT NULL,
    "workplaceType" TEXT NOT NULL,
    "currentState" TEXT NOT NULL,
    "publishedDate" DATETIME NOT NULL,
    "applicationDeadline" DATETIME
);
INSERT INTO "new_job" ("applicationDeadline", "city", "companyId", "companyLogo", "companyName", "contractType", "country", "currentState", "description", "education", "hardSkills", "id", "jobUrl", "publishedDate", "seniority", "state", "title", "workplaceType") SELECT "applicationDeadline", "city", "companyId", "companyLogo", "companyName", "contractType", "country", "currentState", "description", "education", "hardSkills", "id", "jobUrl", "publishedDate", "seniority", "state", "title", "workplaceType" FROM "job";
DROP TABLE "job";
ALTER TABLE "new_job" RENAME TO "job";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
