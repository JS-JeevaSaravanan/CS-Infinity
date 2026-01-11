import { describe, it, expect, beforeEach } from "bun:test";
import { createServer } from "../../src/server-core";
import type { Handler } from "../../src/router/router";

describe("create server", () => {
  let fetchHandler: Handler;

  beforeEach(() => {
    const server = createServer();
    fetchHandler = server.fetch!;
  });

  it("serves index.html for /", async () => {
    const req = new Request("http://localhost/");
    const res = await fetchHandler(req);

    expect(res.status).toBe(200);
    // expect(await res.text()).toContain("Home");
  });

  // it("returns 404 for unknown frontend route", async () => {
  //   const req = new Request("http://localhost/unknown");
  //   const res = await fetchHandler(req);

  //   expect(res.status).toBe(404);
  // });
});
