import { z } from "zod";


export const locale = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string(),
})

export const company = z.object({
  companyId: z.coerce.number(),
  companyLogo: z.string(),
  companyName: z.string(),
})

export const jobDetails = z.object({
  title: z.string(),
  description: z.string(),
  jobId: z.coerce.number(),

  hardSkills: z.array(z.string()).transform(val => JSON.stringify(val)),
  education: z.array(z.string()).transform(val => JSON.stringify(val)),

  seniority: z.array(z.string()).transform(val => JSON.stringify(val)),
  contractType: z.array(z.string()).transform(val => JSON.stringify(val)),

  jobUrl: z.string(),
  workplaceType: z.string(),
  currentState: z.string(),
  platform: z.string(),

  publishedDate: z.coerce.date(),
  applicationDeadline: z.coerce.date().optional(),
})

export const gupySchema = jobDetails.omit({
  hardSkills: true,
  education: true,
  seniority: true,
  currentState: true,
})
  .merge(locale.partial())
  .merge(company.partial({
    companyLogo: true,
  }))

export const solidesSchema = jobDetails
  .merge(locale.partial())
  .merge(company.partial({
    companyLogo: true,
    companyId: true,
  }))