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

const getTranspiledJsFromTs = async (file: Bun.BunFile) => {
  const code = await file.text();
  return transpiler.transformSync(code);
};

export const getFileIfExist = async (path: string) => {
  const file = Bun.file(path);
  if (await file.exists()) {
    if (path.endsWith(".ts")) {
      const transpiled = await getTranspiledJsFromTs(file);
      return new Response(transpiled, {
        headers: {
          "Content-Type": "application/javascript; charset=UTF-8",
        },
      });
    }
    return new Response(file);
  }
  return null;
};
