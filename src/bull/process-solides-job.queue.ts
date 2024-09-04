import type { GupyProcessedJob } from "@/@types/job";
import type { SolidesJob } from "@/@types/solides";
import { SendWebhook } from "@/lib/discord-webhook";
import langChainProcessJob from '@/lib/ia';
import { prisma } from '@/lib/prisma';
import wait from "@/utils/wait";
import { type ConnectionOptions, type Job, Queue, Worker } from 'bullmq';
import { env } from 'env';

const queueName = 'process-solides-jobs'

const connection: ConnectionOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD ?? '',
  username: env.REDIS_USER,

  enableReadyCheck: false,
  maxRetriesPerRequest: null,
  enableOfflineQueue: true,
}

export const queue = new Queue(queueName, {
  connection,
});

const worker = new Worker(
  queueName,
  async (job: Job<SolidesJob, any, string>) => {
    console.log(`[LOG] Job ID: ${job?.id} init`);

    const {
      id,
      companyLogo,
      companyName,
      description,
      hardSkills,
      education,
      language,
      seniority,
      jobType,
      createdAt,
      redirectLink,
      title,
      city,
      state
    } = job.data;
    try {
      let jobDetails: GupyProcessedJob

      const requisites: string = ''

      await wait(5000)
      const requisitesArray: any = await langChainProcessJob(
        requisites.concat(
          `job_${id} 
          ${description}


          <Mais Detalhes>
          ${JSON.stringify(hardSkills)}
          ${JSON.stringify(education)}
          ${JSON.stringify(language)}
          ${JSON.stringify(seniority)}
          </Mais Detalhes>
          `)
      )

      job.updateProgress(50);
      await wait(5000)
      const match = Number.parseInt(requisitesArray['match']) ?? 0

      if (requisitesArray) {
        requisitesArray.match = undefined

        jobDetails = {
          jobId: id,
          title: title,
          link: redirectLink,
          description: description,
          img: companyLogo,
          requisites: requisitesArray,
          company: companyName,
          local: `${city?.name ?? '-'}, ${state?.name ?? '-'}`,
          modality: jobType,
          publishDate: new Date(createdAt)
        }

        const processJob = await prisma.processJob.upsert({
          where: {
            id: id
          },
          create: {
            ...jobDetails,
            requisites: JSON.stringify(requisitesArray),
            match
          },
          update: {
            ...jobDetails,
            requisites: JSON.stringify(requisitesArray),
            match
          },
          select: {
            id: true,
            jobId: true,
            title: true,
            description: true,
            company: true,
            local: true,
            requisites: true,
            modality: true,
            link: true,
            publishDate: true,
            img: true,
            match: true,
          }
        })

        await SendWebhook(processJob);

        // process
        job.updateProgress(100);

        return jobDetails;
      }

      return false
    } catch (err: any) {
      console.error('[ERR]: BAD')
      throw err
    }

  },
  {
    concurrency: 10,
    connection,
  }
);

worker.on('error', (err) => {
  console.error(err);
});

worker.on('closed', () => {
  console.warn('[LOG] Worker closed');
});

worker.on('ready', () => {
  console.warn('[LOG] Worker is ready!');
});

worker.on('completed', (job) => {
  console.log(`[LOG] Job ID: ${job?.id} completed`);
});

worker.on('failed', (job, err) => {
  console.error(`[LOG] Job ID: ${job?.id} failed with ${err.message}`);
});

const processSolidesJob = {
  queue,
  worker
}

export default processSolidesJob