import type { HTTPMethod } from "../types/http";
import { NotFoundResponse } from "../utils/http-response";

export type Handler = (req: Request) => HandlerResponse;
export type HandlerResponse = Promise<Response> | Response;

export type Route = {
  method: HTTPMethod;
  path: string;
  handler: Handler;
};

export const withErrorHandling =
  (handler: Handler): Handler =>
  async (req) => {
    try {
      return await handler(req);
    } catch (err) {
      console.error(err);
      return new Response("Internal Server Error", { status: 500 });
    }
  };

export class Router {
  private routes: Route[] = [];

  register(routes: Route[]) {
    this.routes.push(...routes);
  }

  async handle(req: Request): Promise<Response> {
    const pathname = new URL(req.url).pathname;

    const matchRoute = this.routes.find(
      (route) => route.method === req.method && route.path === pathname,
    );

    if (matchRoute) {
      const safeHandler = withErrorHandling(matchRoute.handler);
      return await safeHandler(req);
    }

    return NotFoundResponse; // 404 fallback
  }
}
