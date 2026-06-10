import { FILES } from "../const/folders";
import { PORT } from "../const/server";
import { routeConfigs } from "../router/config";
import { Router } from "../router/router";
import { getFileIfExist } from "../utils/file-operations";
import { createRequestHandler } from "./handler";

export const createServer = () => {
  const router = new Router();
  router.register(routeConfigs);

  const handler = createRequestHandler({
    router,
    getFileIfExist,
  });

  return Bun.serve({
    port: PORT,
    fetch: handler,
  });
};
