import type { SolidesJob } from '@/@types/solides'
import processSolidesJob from '@/bull/process-solides-job.queue'
import { prisma } from '@/lib/prisma'
import { getSolidesJobs } from '@/lib/solides-api'
import { solidesSchema } from '@/utils/zod/jobs'
import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'

// https://apigw.solides.com.br/jobs/v3/portal-vacancies-new?page=1&title=Fullstack&locations=&take=10
export async function findSolidesJobs(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get(
      '/find-solides-jobs/:jobName',
      {
        schema: {
          tags: ['Jobs'],
          summary: 'Get Jobs',
          security: [{ bearerAuth: [] }],
          params: z.object({
            jobName: z.string(),
          }),
          querystring: z.object({
            locations: z.string().min(4).optional().describe('Valid format: (city - UF)'),
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
        const { locations } = request.query

        const allJobs = await getSolidesJobs({
          jobName,
          locations
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
            platform: 'SOLIDES'
          }
        }).then(jobs => jobs.map(job => job.jobId))

        await Promise.all(
          allJobs.map((job: SolidesJob) => {
            if (jobsIds.includes(job.id)) {
              return
            }

            const data = solidesSchema.parse({
              jobId: job.id,
              title: job.title,
              description: job.description,
              platform: 'SOLIDES',
              currentState: job.currentState,

              companyLogo: job.companyLogo ?? '',
              companyName: job.companyName,

              city: job.city?.name ?? '-',
              state: job.state?.name ?? '-',
              country: 'Brasil',

              jobUrl: job.redirectLink,
              contractType: job.recruitmentContractType.map(e => e.name),
              workplaceType: job.jobType ?? job.jobType ? 'remote' : 'not remote',

              seniority: job.seniority.map(e => e.name),
              language: job.language.map(e => e.name),
              hardSkills: job.hardSkills.map(e => e.name),
              education: job.education.map(e => e.name),

              publishedDate: job.createdAt ? new Date(job.createdAt) : undefined,
              applicationDeadline: undefined,
            })

            return Promise.all([
              prisma.job.upsert({
                where: {
                  jobId: job.id
                },
                update: {
                  ...data,
                },
                create: data,
              }),
              processSolidesJob.queue.add(
                `job_solides_${job.id}`,
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