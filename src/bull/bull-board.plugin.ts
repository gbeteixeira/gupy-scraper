import fastifyPlugin from "fastify-plugin";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter.js";
import { FastifyAdapter } from "@bull-board/fastify";
import { createBullBoard } from "@bull-board/api";
import { allQueue } from "./queues";

export const bullBoardPlugin = fastifyPlugin(async (app) => {
  const serverAdapter = new FastifyAdapter();

  createBullBoard({
    queues: allQueue.map((queue) => new BullMQAdapter(queue)),
    serverAdapter,
  });

  serverAdapter.setBasePath("/ui");

  await app.register(serverAdapter.registerPlugin(), {
    basePath: "/ui",
    prefix: "/ui",
  });
});