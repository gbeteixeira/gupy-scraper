import type { ProcessJob } from "@prisma/client";
import axios from "axios";
import { env } from "env";

export const SendWebhook = async (job: ProcessJob) => {
  console.log('[DISCORD] - Enviando vaga para o discord')

  console.log(`[MATCH] ${job.match}`)
  if (job.match < 70) {
    console.log('[DISCORD] - Perfil não atende 70% dos requisitos')
    return
  }

  return await axios.post(
    env.DISCORD_CHANNEL_WEBHOOK,
    {
      "embeds": [
        {
          "title": `${job.title}`,
          // "description": `${job.description}`,
          "color": 1996552,
          "fields": [
            {
              "name": "Match",
              "value": `${job.match}`,
            },
            {
              "name": "Modalidade",
              "value": `${job.modality}`,
            },
            {
              "name": "Empresa",
              "value": `${job.company} - ${job.local}`,
            },
            {
              "name": "Requisitos",
              "value": `${job.requisites}`,
            },
            {
              "name": "Link",
              "value": `${job.link}`,
            }
          ],
          "thumbnail": {
            "url": `${job.img}`,
          },
        }
      ],
      "username": "@cria-das-vagas",
      "attachments": []
    }
  ).catch(e => console.error(e.message))
}