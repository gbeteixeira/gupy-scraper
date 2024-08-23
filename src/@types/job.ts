export interface Job {
  id: number
  companyId: number
  name: string
  description: string
  careerPageId: number
  careerPageName: string
  careerPageLogo: string
  type: string
  publishedDate: string
  applicationDeadline: string
  isRemoteWork: boolean
  city: string
  state: string
  country: string
  jobUrl: string
  badges: Badges
  disabilities: boolean
  workplaceType: string
  careerPageUrl: string
}

export interface Badges {
  friendlyBadge: boolean
}