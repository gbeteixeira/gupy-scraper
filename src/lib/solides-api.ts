import type { Job } from '@/@types/job'
import type { SolidesJob } from '@/@types/solides'
import axios from 'axios'

interface GetSolidesJobsResponse {
  success: boolean,
  errors: Array<any>
  data: {
    totalPages: number
    currentPage: number
    count: number
    data: SolidesJob[]
  }
}

interface IGetSolidesJobs {
  jobName: string
  locations?: string
}

export const api = axios.create({
  baseURL: 'https://apigw.solides.com.br/jobs/v3/',
})

export const getSolidesJobs = async ({
  jobName,
  locations
}: IGetSolidesJobs) => {
  const limit = 100;
  let allJobs: Array<SolidesJob> = [];
  let page = 1;
  let hasMoreData = true;

  while (hasMoreData) {
    try {

      const response = await api.get<GetSolidesJobsResponse>('portal-vacancies-new', {
        params: {
          title: jobName,
          locations,
          limit,
          page,
        }
      });

      const { data } = response.data;

      // Se não houver mais dados ou a resposta estiver vazia, pare o loop
      if (data.totalPages === data.currentPage) {
        hasMoreData = false;
      }

      // Adicione os dados recebidos ao array principal
      allJobs = allJobs.concat(data.data);

      // Atualize o page para a próxima chamada
      page++

    } catch (error) {
      console.error('Erro ao buscar os dados:', error);
      hasMoreData = false;
    }
  }

  return allJobs
}