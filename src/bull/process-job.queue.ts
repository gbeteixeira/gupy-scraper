import type { Job as IJobs } from "@/@types/job";
import langChainProcessJob from '@/lib/ia';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import { type ConnectionOptions, type Job, Queue, Worker } from 'bullmq';
import { load } from 'cheerio';
import { env } from 'env';

const queueName = 'process-jobs'

const connection: ConnectionOptions = {
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD ?? '',
  username: env.REDIS_USER,
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  },
}

export const processJob = new Queue(queueName, {
  connection,
});

const worker = new Worker(
  queueName,
  async (job: Job<IJobs, any, string>) => {
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

    const response = await axios(jobUrl);
    const html = response.data;
    const $ = load(html);
    let jobDetails = {};

    const hasRequisites = $('h2[data-testid="section-Requisitos e qualificações-title"]').parent().find(".sc-add46fb1-3")
    const requisites: string = ''

    if (hasRequisites) {

      const imgElement = $('img[alt="Logo da empresa"]');
      let imgSrc = "";

      if (imgElement) {
        imgSrc = (`https://portal.gupy.io/${imgElement.attr('src')}`);
      }

      const description = hasRequisites.parent().find(".sc-add46fb1-3").text()
      const requisitesArray: any = await langChainProcessJob(requisites.concat(`job_${id} ${description}`))
      const match = Number.parseInt(requisitesArray['match']) ?? 0

      if (requisitesArray) {
        requisitesArray.match = undefined

        jobDetails = {
          id: id,
          link: jobUrl,
          description: description,
          img: imgSrc ?? careerPageLogo ?? undefined,
          requisites: requisitesArray,
          company: careerPageName ?? jobUrl.replaceAll('http://', '').replaceAll('https://', '').split('.')[0] ?? id,
          local: `${city ?? '-'}, ${state ?? '-'} - ${country ?? '-'}`,
          title: name,
          modality: workplaceType,
          publishDate: publishedDate
        }


        await prisma.processJob.upsert({
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
          }
        })
      }
    }

    // process
    job.updateProgress(100);

    return jobDetails;

  },
  {
    concurrency: 1,
    connection
  }
);

worker.on("completed", (job) => {
  console.log(`[LOG] Job ID: ${job.id} has completed!`);
});

worker.on("failed", (job, err) => {
  console.log(`[LOG] Job ID: ${job?.id} has failed with ${err.message}`);
});

processJob.on('error', (err) => console.error('[LOG] Queue Error:', err));
worker.on('error', (err) => console.error('[LOG] Worker Error:', err));

console.log("[LOG] Worker started!");
