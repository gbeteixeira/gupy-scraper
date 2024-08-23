-- CreateTable
CREATE TABLE "job" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "publishedDate" DATETIME NOT NULL,
    "applicationDeadline" DATETIME NOT NULL,
    "isRemoteWork" BOOLEAN NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "jobUrl" TEXT NOT NULL,
    "workplaceType" TEXT NOT NULL,
    "careerPageUrl" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "process_job" (
    "id" TEXT NOT NULL PRIMARY KEY,
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

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cv" TEXT NOT NULL
);
