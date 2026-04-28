export const authMiddleware: Middleware = async (req, next) => {
  const auth = req.headers.get("authorization");

  if (!auth?.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const token = auth.slice(7);
    req.user = verifyJWT(token);
    return next();
  } catch {
    return new Response("Invalid token", { status: 401 });
  }
};
