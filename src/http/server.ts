import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUI from '@fastify/swagger-ui'
import {
  type ZodTypeProvider,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { bullBoardPlugin } from '@/bull/bull-board.plugin'
import { errorHandler } from '@/http/error-handler'
import { task } from '@/lib/schedule'
import fastify from 'fastify'
import { findGupyJobs } from './routes/jobs/find-gupy-jobs'
import { findSolidesJobs } from './routes/jobs/find-solides-jobs'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.setErrorHandler(errorHandler)

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Find Jobs',
      description: '',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.register(fastifyCors)

app.register(findGupyJobs)
app.register(findSolidesJobs)

app.register(bullBoardPlugin);

app.listen({ port: 3333 }).then(() => {
  console.log('[LOG] HTTP server running!')
  task.start()
})