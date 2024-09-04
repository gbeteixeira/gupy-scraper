/*
  Warnings:

  - A unique constraint covering the columns `[jobId]` on the table `job` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "job_jobId_key" ON "job"("jobId");
