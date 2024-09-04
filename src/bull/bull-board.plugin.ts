import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { FastifyAdapter } from "@bull-board/fastify";
import fastifyPlugin from "fastify-plugin";
import { allQueues, allWorkers } from "./queues";

export const bullBoardPlugin = fastifyPlugin(async (app) => {
  const serverAdapter = new FastifyAdapter();

  createBullBoard({
    queues: allQueues.map((queue) => new BullMQAdapter(queue)),
    serverAdapter,
  });

  serverAdapter.setBasePath("/ui");

  await app.register(serverAdapter.registerPlugin(), {
    basePath: "/ui",
    prefix: "/ui",
  });

  const shutdown = async () => {
    await Promise.all(
      allWorkers.map(worker => worker.close())
    )

    process.exit(0);
  }

  process.on("SIGTERM", shutdown)
  process.on("SIGINT", shutdown)
});