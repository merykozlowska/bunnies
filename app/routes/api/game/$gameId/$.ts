import type { LoaderFunction } from "@remix-run/cloudflare";
import type { Params } from "react-router";

import type { LoaderContext } from "~/model/loaderContext";

export const loader: LoaderFunction = async ({
  context,
  params,
  request,
}: {
  context: LoaderContext;
  params: Params;
  request: Request;
}) => {
  if (params.gameId !== "global") {
    return new Response("game id not allowed", { status: 400 });
  }
  const id = context.GAME.idFromName("global");
  const gameObject = context.GAME.get(id);

  const newUrl = new URL(request.url);
  newUrl.pathname = params["*"] || "/";
  return gameObject.fetch(newUrl.toString(), request);
};
