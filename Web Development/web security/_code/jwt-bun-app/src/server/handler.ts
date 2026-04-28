import type { Router } from "../router/router";
import type { getFileIfExist } from "../utils/file-operations";
import { FILES } from "../const/folders";

export const createRequestHandler = (deps: {
  router: Router;
  getFileIfExist: typeof getFileIfExist;
}) => {
  const { router, getFileIfExist } = deps;

  return async (req: Request) => {
    const url = new URL(req.url);

    if (url.pathname.startsWith("/api")) {
      return router.handle(req);
    }

    const filePath =
      url.pathname === "/" ? `${FILES}/index.html` : `${FILES}${url.pathname}`;

    const res = await getFileIfExist(filePath);
    if (!res) {
      console.log("# comming here");
      return Response.redirect("/404.html", 302);
    } else {
      return res;
    }
  };
};
