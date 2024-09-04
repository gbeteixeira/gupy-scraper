export interface SolidesJob {
  affirmative: any[]
  id: number
  title: string
  description: string
  currentState: string
  companyName: string
  companyLogo: string
  state: any
  city: any
  slug: string
  redirectLink: string
  type: string
  isHiddenJob: boolean
  homeOffice: boolean
  jobType: string
  openPositions: number
  salary: Salary
  hasSpecialNeeds: boolean
  peopleWithDisabilities: boolean
  disabilityType: any
  pcdOnly: boolean
  videoUrl: any
  seniority: any[]
  recruitmentContractType: RecruitmentContractType[]
  benefits: any[]
  language: Language[]
  hardSkills: HardSkill[]
  education: Education[]
  createdAt: string
  availablePositions: number
  showModality: boolean
  occupationAreas: any[]
  isGoogleForJobsEnabled: boolean
}

export interface Salary {
  type: string
  showRangeToApplicant: boolean
  initialRange: any
  finalRange: any
  negotiable: boolean
}

export interface RecruitmentContractType {
  id: number
  name: string
  level: any
}

export interface Language {
  id: number
  name: string
  level: number
}

export interface HardSkill {
  id: number
  name: string
  level: number
}

export interface Education {
  id: number
  name: string
  level: any
}
