import { createServer } from "./server/create-server";

const server = createServer();
console.log(`🚀 Server running on http://localhost:${server.port}`);
