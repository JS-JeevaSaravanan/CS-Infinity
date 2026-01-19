import { GetPriceSchema } from "./types";
import { getProductPriceDetailsWithExceptions } from "./exception/price-details";
import { getProductPriceDetailsWithResult } from "./result/price-details";

Bun.serve({
  port: 3000,

  async fetch(req) {
    const url = new URL(req.url);

    if (req.method === "POST") {
      const body = await req.json();
      const parsed = GetPriceSchema.safeParse(body);

      if (!parsed.success) {
        return Response.json(parsed.error, { status: 400 });
      }

      // 🔥 EXCEPTION FLOW
      if (url.pathname === "/exception-price") {
        try {
          const result = getProductPriceDetailsWithExceptions(parsed.data);
          return Response.json(result);
        } catch (error) {
          return Response.json(
            {
              error: error instanceof Error ? error.message : "UNKNOWN_ERROR",
            },
            { status: 400 },
          );
        }
      }

      // ✅ RESULT FLOW
      if (url.pathname === "/result-price") {
        const result = getProductPriceDetailsWithResult(parsed.data);

        if (!result.ok) {
          return Response.json({ error: result.error }, { status: 400 });
        }

        return Response.json(result.value);
      }
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log("🚀 Server running on http://localhost:3000");
