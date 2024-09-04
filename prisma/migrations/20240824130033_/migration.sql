/*
  Warnings:

  - You are about to drop the column `careerPageUrl` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `isRemoteWork` on the `job` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `job` table. All the data in the column will be lost.
  - Added the required column `companyLogo` to the `job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contractType` to the `job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currentState` to the `job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `education` to the `job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hardSkills` to the `job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `seniority` to the `job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `job` table without a default value. This is not possible if the table is not empty.
  - Made the column `type` on table `job` required. This step will fail if there are existing NULL values in that column.

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
    "serviceName" TEXT NOT NULL,
    "currentState" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "jobUrl" TEXT NOT NULL,
    "workplaceType" TEXT,
    "publishedDate" DATETIME NOT NULL,
    "applicationDeadline" DATETIME
);
INSERT INTO "new_job" ("applicationDeadline", "city", "companyId", "country", "id", "jobUrl", "publishedDate", "state", "type", "workplaceType") SELECT "applicationDeadline", "city", "companyId", "country", "id", "jobUrl", "publishedDate", "state", "type", "workplaceType" FROM "job";
DROP TABLE "job";
ALTER TABLE "new_job" RENAME TO "job";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
