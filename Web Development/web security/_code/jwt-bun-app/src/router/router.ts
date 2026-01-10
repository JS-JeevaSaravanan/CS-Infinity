import type { HTTPMethod } from "../types/http";
import { NotFoundResponse } from "../utils/http-response";

export type Handler = (req: Request) => HandlerResponse;
type HandlerResponse = Promise<Response> | Response;
export type Route = {
  method: HTTPMethod;
  path: string;
  handler: Handler;
};

export class Router {
  private routes: Route[] = [];

  register(routes: Route[]) {
    this.routes.push(...routes);
  }

  async handle(req: Request): Promise<Response> {
    const findMatchRoute = (route: Route) =>
      req.method === route.method && new URL(req.url).pathname === route.path;

    const matchRoute = this.routes.find(findMatchRoute);
    if (matchRoute) {
      return await matchRoute.handler(req);
    }

    return NotFoundResponse;
  }
}
