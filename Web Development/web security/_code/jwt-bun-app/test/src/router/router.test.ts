import { describe, it, expect } from "bun:test";
import { Router } from "../../../src/router/router";
import { HTTPMethodType } from "../../../src/types/http";

describe("router", () => {
  it("returns 404 when route is not found", async () => {
    const router = new Router();

    const req = new Request("http://www.localhost.com", {
      method: HTTPMethodType.GET,
    });
    const res = await router.handle(req);

    expect(res.status).toBe(404);
    expect(await res.text()).toBe("Not Found");
  });

  it("calls handler for registered route", async () => {
    const router = new Router();

    router.register([
      {
        method: HTTPMethodType.GET,
        path: "/hello",
        handler: () => new Response("Hello"),
      },
    ]);

    const req = new Request("http://localhost.com/hello", {
      method: "GET",
    });

    const res = await router.handle(req);

    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello");
  });
});
