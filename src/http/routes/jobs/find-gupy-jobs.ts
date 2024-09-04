import type { Job } from '@/@types/job'
import processGupyJob from '@/bull/process-gupy-job.queue'
import { getGupyJobs } from '@/lib/gupy-api'
import { prisma } from '@/lib/prisma'
import extractSubdomain from '@/utils/extract-subdomain'
import { gupySchema } from '@/utils/zod/jobs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

export async function findGupyJobs(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/find-gupy-jobs/:jobName',
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


        const allJobs = await getGupyJobs({
          jobName,
          badges,
          isRemoteWork,
          publishedDate
        })

        /**
         * Get all jobsIds in database
         */
        const jobsIds = await prisma.job.findMany({
          select: {
            jobId: true,
          },
          where: {
            jobId: {
              in: allJobs.map(job => job.id),
            },
            platform: 'GUPY'
          }
        }).then(jobs => jobs.map(job => job.jobId))

        await Promise.all(
          allJobs.map((job: Job) => {
            if (jobsIds.includes(job.id)) {
              return
            }

            const data = gupySchema.parse({
              jobId: job.id,
              title: job.name,
              description: job.description,
              platform: 'GUPY',

              companyId: job.companyId ? Number(job.companyId) : undefined,
              companyLogo: job.careerPageLogo,
              companyName: extractSubdomain(job.jobUrl),

              city: job.city,
              state: job.state,
              country: job.country,

              jobUrl: job.jobUrl,
              contractType: [job.type],
              workplaceType: job.workplaceType ?? job.isRemoteWork ? 'remote' : 'not remote',

              publishedDate: job.publishedDate ? new Date(job.publishedDate) : undefined,
              applicationDeadline: job.applicationDeadline ? new Date(job.applicationDeadline) : undefined,
            })

            return Promise.all([
              prisma.job.upsert({
                where: {
                  jobId: job.id
                },
                update: data,
                create: data,
              }),
              processGupyJob.queue.add(
                `job_gupy_${job.id}`,
                job,
                {
                  removeOnComplete: true,
                  attempts: 3,
                  delay: 5000,
                }
              )
            ])
          })
        )

        console.info(`[LOG] ${allJobs.length - jobsIds.length} novos jobs`)
        return reply.status(201).send({
          message: 'Success',
        })
      },
    )
}