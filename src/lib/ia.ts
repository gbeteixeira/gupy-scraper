import { readFileSync } from "node:fs";
import { extractJson } from "@/utils/extract-json";
import { HumanMessage } from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableLambda } from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "env";


export const langChainProcessJob = async (jobDetails: string) => {
  console.log(`[LOG]: Enviando vagas para LANGCHAIN ${new Date().getTime()}`)

  const image = readFileSync("./cv.png").toString("base64");

  const model = new ChatGoogleGenerativeAI({
    model: env.MODEL_NAME,
    temperature: 0,
    apiKey: env.API_KEY
  });

  const schema = `{{ programmingLanguages: ["Node", "PHP"], databases: ["MySQL", "NoSQL (MongoDB, DynamoDB)"], frameworks: ["RESTful APIs", "NESTJS"], match: "69" }}`;

  // Prompt
  const prompt = await ChatPromptTemplate.fromMessages([
    [
      "system",
      `Você é um assistente de vagas personalizadas, abaixo você ira receber os detalhes da vaga e o currículo do usuário, 
      sua tarefa é analisar os dados e retornar um valor de 0 - 100 que essa vaga dá match com o currículo inserido,
      Com base nas na descrição da vaga e no meu perfil você deve me retornar APENAS requisitos obrigatórios que sejam LINGUAGENS DE PROGRAMAÇÃO, FRAMEWORKS E BANCO DE DADOS. Preciso que devolva no formato JSON: \`\`\`json\n{schema}\n\`\`\`.
      Lembre-se de responder utilizando as tags \`\`\`json and \`\`\` 
      Se fizer o trabalho correto, ganhará $200, caso falhe será demitido e trocado por uma IA mais inteligente
      `,
    ],
    ["human", "Meu curriculo: <CV>{cvDetails}</CV>, Vaga: <Job>{jobDetails}</Job>"],

  ]).partial({
    schema,
  });

  const chain = prompt
    .pipe(model)
    .pipe(new RunnableLambda({ func: extractJson }));

  try {
    const data = await chain.invoke({
      jobDetails,
      cvDetails:
        new HumanMessage({
          content: [
            {
              type: "text",
              text: "Analise o currículo abaixo e utilize todos os dados do candidato.",
            },
            {
              type: "image_url",
              image_url: `data:image/png;base64,${image}`,
            },
          ],
        }),

    });

    return data[0] ?? {}
  } catch (err: any) {
    throw err
  }
}

export default langChainProcessJob