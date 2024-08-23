import type { Job } from '@/@types/job'
import { processJob } from '@/bull/process-job.queue'
import { prisma } from '@/lib/prisma'
import axios from 'axios'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function findJobs(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/find-jobs/:jobName',
      {
        schema: {
          tags: ['Jobs'],
          summary: 'Get Jobs',
          security: [{ bearerAuth: [] }],
          params: z.object({
            jobName: z.string(),
          }),
          querystring: z.object({
            badges: z.string().min(4).optional(),
            isRemoteWork: z.coerce.boolean().optional(),
            publishedDate: z.coerce.date().optional(),
          }),
          response: {
            201: z.object({
              message: z.string()
            }),
          },
        },
      },
      async (request, reply) => {
        const { jobName } = request.params
        const { badges, isRemoteWork, publishedDate } = request.query

        const limit = 10;
        let offset = 0;
        let allJobs: Array<Job> = [];
        let hasMoreData = true;

        while (hasMoreData) {
          try {
            const response = await axios.get('https://portal.api.gupy.io/api/v1/jobs', {
              params: {
                jobName,
                limit,
                offset,
                badges,
                isRemoteWork,
                publishedDate,
              }
            });

            const { data, pagination } = response.data;

            // Se não houver mais dados ou a resposta estiver vazia, pare o loop
            if (data.length === 0 || pagination.offset + limit >= pagination.total) {
              hasMoreData = false;
            }

            // Adicione os dados recebidos ao array principal
            allJobs = allJobs.concat(data);

            // Atualize o offset para a próxima chamada
            offset += limit;

          } catch (error) {
            console.error('Erro ao buscar os dados:', error);
            hasMoreData = false;
          }
        }

        await Promise.all(
          allJobs.map((job: Job) => {
            const data = {
              id: job.id,
              companyId: job.companyId,
              name: job.name,
              type: job.type,
              publishedDate: job.publishedDate,
              applicationDeadline: job.applicationDeadline,
              isRemoteWork: job.isRemoteWork,
              city: job.city,
              state: job.state,
              country: job.country,
              jobUrl: job.jobUrl,
              workplaceType: job.workplaceType,
              careerPageUrl: job.careerPageUrl,
            }

            return Promise.all([
              prisma.job.upsert({
                where: {
                  id: job.id
                },
                update: data,
                create: data,
              }),
              processJob.add(
                `job_${job.id}`,
                job,
                {
                  removeOnComplete: true,
                  delay: 5000,
                  attempts: 3,
                }
              )
            ])
          })
        )

        return reply.status(201).send({
          message: 'Success',
        })
      },
    )
}