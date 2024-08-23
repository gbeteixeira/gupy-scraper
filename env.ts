import { z } from 'zod'

export const envSchema = z.object({
  SERVER_PORT: z.coerce.number().default(3333),
  DATABASE_URL: z.string().url(),

  REDIS_HOST: z.string().optional().default("127.0.0.1"),
  REDIS_USER: z.string().optional(),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_PASSWORD: z.string().optional().nullable(),
  REDIS_DB: z.coerce.number().optional().default(0),

  MODEL_NAME: z.string(),
  API_KEY: z.string(),
})

export const env = envSchema.parse(process.env);