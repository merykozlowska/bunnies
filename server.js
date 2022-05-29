import { createPagesFunctionHandler } from "@remix-run/cloudflare-pages";
import * as build from "@remix-run/dev/server-build";

const handleRequest = createPagesFunctionHandler({
  build,
  mode: process.env.NODE_ENV,
  getLoadContext: (context) => context.env,
});

export default {
  async fetch(request, env, ctx) {
    return handleRequest({
      request: new Request(request),
      env,
      waitUntil: ctx.waitUntil,
      params: {},
      data: undefined,
      next: () => {
        throw new Error("next() called in Worker");
      },
    });
  },
};

export { Game } from "./durable_objects/src/game";
