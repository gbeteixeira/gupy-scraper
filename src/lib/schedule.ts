import axios from 'axios';
import cron from 'node-cron';

export const task = cron.schedule('0 8-20 * * 1-5', () => {
  console.log(`[CRON TASK] Disparado as ${new Date().getTime()}`)
  const api = axios.create({
    baseURL: 'http://localhost:3333'
  })

  // fullstack solides
  api.post('/find-gupy-jobs/fullstack');

  // fullstack solides
  api.post('find-solides-jobs/fullstack');

  // backend gupy
  api.post('find-gupy-jobs/backend');

  // backend solides
  api.post('find-solides-jobs/backend');
});
