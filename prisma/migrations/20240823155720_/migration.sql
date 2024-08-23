-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyId" INTEGER NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "isRemoteWork" BOOLEAN NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "jobUrl" TEXT NOT NULL,
    "workplaceType" TEXT,
    "careerPageUrl" TEXT,
    "publishedDate" DATETIME NOT NULL,
    "applicationDeadline" DATETIME
);
INSERT INTO "new_job" ("applicationDeadline", "careerPageUrl", "city", "companyId", "country", "id", "isRemoteWork", "jobUrl", "name", "publishedDate", "state", "type", "workplaceType") SELECT "applicationDeadline", "careerPageUrl", "city", "companyId", "country", "id", "isRemoteWork", "jobUrl", "name", "publishedDate", "state", "type", "workplaceType" FROM "job";
DROP TABLE "job";
ALTER TABLE "new_job" RENAME TO "job";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
