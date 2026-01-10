import { FILES } from "./const/folders";
import { PORT } from "./const/server";
import { routeConfigs } from "./router/config";
import { Router } from "./router/router";
import { getFileIfExist } from "./utils/file-operations";

export const createServer = () => {
  const router = new Router();
  router.register(routeConfigs);
  return Bun.serve({
    port: PORT,
    async fetch(req) {
      const url = new URL(req.url);

      if (url.pathname.startsWith("/api")) {
        return await router.handle(req);
      }

      const filePath =
        url.pathname === "/"
          ? `${FILES}/index.html`
          : `${FILES}${url.pathname}`;

      return await getFileIfExist(filePath);
    },
  });
};
