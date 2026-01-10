import { NotFoundResponse } from "./http-response";

export const readJSON = async (req: Request) => {
  try {
    return await req.json();
  } catch {
    return null;
  }
};

const transpiler = new Bun.Transpiler({
  loader: "ts",
  target: "browser",
});

export const getTranspiledJsFromTs = async (file: Bun.BunFile) => {
  const code = await file.text();
  const transpiled = transpiler.transformSync(code);

  return new Response(transpiled, {
    headers: {
      "Content-Type": "application/javascript; charset=UTF-8",
    },
  });
};

export const getFileIfExist = async (path: string) => {
  const file = Bun.file(path);
  if (await file.exists()) {
    if (path.endsWith(".ts")) {
      return getTranspiledJsFromTs(file);
    }
    return new Response(file);
  }
  return NotFoundResponse;
};
