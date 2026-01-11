import { createServer } from "./server-core";

const server = createServer();
console.log(`🚀 Server running on http://localhost:${server.port}`);
