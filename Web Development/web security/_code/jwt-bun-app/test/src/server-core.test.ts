// import {
//   describe,
//   it,
//   expect,
//   beforeEach,
//   afterEach,
//   mock,
//   afterAll,
//   beforeAll,
// } from "bun:test";
// import type { Mock } from "bun:test";
// import { createServer } from "../../src/server/server-core";

// describe("server", () => {
//   let server: ReturnType<typeof createServer>;
//   let getFileIfExistMock: Mock<(path: string) => Promise<Response>>;
//   let handleMock: Mock<(_req: Request) => Promise<Response>>;

//   beforeEach(() => {
//     server = createServer();

//     getFileIfExistMock = mock(
//       async (_path: string) => new Response(`FILE`, { status: 200 }),
//     );

//     handleMock = mock(
//       async () => new Response(JSON.stringify({ ok: true }), { status: 200 }),
//     );

//     mock.module("../../src/utils/file-operations", () => ({
//       getFileIfExist: getFileIfExistMock,
//     }));

//     mock.module("../../src/router/router", () => ({
//       Router: class {
//         register() {}
//         handle = handleMock;
//       },
//     }));
//   });

//   afterEach(() => {
//     server.stop(true);
//     mock.clearAllMocks();
//   });

//   it("serves index.html when path is '/'", async () => {
//     const res = await server.fetch(new Request("http://localhost/"));

//     expect(res.status).toBe(200);
//     expect(getFileIfExistMock.mock.calls).toEqual([
//       [expect.stringContaining("index.html")],
//     ]);
//   });

//   it("serves static files for non-api routes", async () => {
//     const res = await server.fetch(new Request("http://localhost/greet.html"));

//     expect(res.status).toBe(200);
//     expect(getFileIfExistMock.mock.calls).toEqual([
//       [expect.stringContaining("greet.html")],
//     ]);

//     expect(await res.text()).toContain("FILE:");
//   });

//   it("delegates /api routes to router.handle", async () => {
//     const res = await server.fetch(new Request("http://localhost/api/users"));

//     expect(res.status).toBe(200);
//     expect(handleMock.mock.calls).toEqual([[expect.any(Request)]]);
//     expect(getFileIfExistMock).not.toHaveBeenCalled();
//   });
// });
