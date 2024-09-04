import type { Job } from '@/@types/job'
import axios from 'axios'

interface GetGupyJobsResponse {
  data: Job[]
  pagination: {
    offset: number
    limit: number
    total: number
  }
}

interface IGetGupyJobs {
  jobName: string
  badges?: string
  isRemoteWork?: boolean
  publishedDate?: Date
}

export const api = axios.create({
  baseURL: 'https://portal.api.gupy.io/api/v1',
})

export const getGupyJobs = async ({
  jobName,
  badges,
  isRemoteWork,
  publishedDate
}: IGetGupyJobs) => {
  let allJobs: Array<Job> = [];

  const limit = 10;
  let offset = 0;
  let hasMoreData = true;

  while (hasMoreData) {
    try {

      const response = await api.get<GetGupyJobsResponse>('jobs', {
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

  return allJobs
}