import processGupyJob from "./process-gupy-job.queue";
import processSolidesJob from "./process-solides-job.queue";

export const allQueues = [
  processGupyJob.queue,
  processSolidesJob.queue
]

export const allWorkers = [
  processGupyJob.worker,
  processSolidesJob.worker
]