import type { GupyProcessedJob, Job as IJobs } from "@/@types/job";
import { SendWebhook } from "@/lib/discord-webhook";
import langChainProcessJob from '@/lib/ia';
import { prisma } from '@/lib/prisma';
import wait from "@/utils/wait";
import axios from 'axios';
import { type ConnectionOptions, type Job, Queue, Worker } from 'bullmq';
import { load } from 'cheerio';
import { env } from 'env';

const queueName = 'process-gupy-jobs'

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
  async (job: Job<IJobs, any, string>) => {
    console.log(`[LOG] Job ID: ${job?.id} init`);

    const {
      id,
      name,
      jobUrl,
      publishedDate,
      careerPageLogo,
      workplaceType,
      city,
      state,
      country,
      careerPageName
    } = job.data;

    try {
      const response = await axios(jobUrl);
      const html = response.data;
      const $ = load(html);
      let jobDetails: GupyProcessedJob

      const hasRequisites = $('h2[data-testid="section-Requisitos e qualificações-title"]').parent().find(".sc-add46fb1-3")
      const requisites: string = ''

      if (hasRequisites) {

        const imgElement = $('img[alt="Logo da empresa"]');
        let imgSrc = "";

        if (imgElement.attr('src')) {
          imgSrc = (`https://portal.gupy.io/${imgElement.attr('src')}`);
        }

        const description = hasRequisites.parent().find(".sc-add46fb1-3").text()
        await wait(5000)
        const requisitesArray: any = await langChainProcessJob(requisites.concat(`job_${id} ${description}`))
        job.updateProgress(50);
        await wait(5000)
        const match = Number.parseInt(requisitesArray['match']) ?? 0

        if (requisitesArray) {
          requisitesArray.match = undefined

          jobDetails = {
            jobId: id,
            title: name,
            link: jobUrl,
            description: description,
            img: imgSrc ?? careerPageLogo ?? undefined,
            requisites: requisitesArray,
            company: careerPageName ?? jobUrl.replaceAll('http://', '').replaceAll('https://', '').split('.')[0] ?? id,
            local: `${city ?? '-'}, ${state ?? '-'} - ${country ?? '-'}`,
            modality: workplaceType,
            publishDate: new Date(publishedDate)
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

const processGupyJob = {
  queue,
  worker
}

export default processGupyJob