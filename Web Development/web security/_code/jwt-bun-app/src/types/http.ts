export const HTTPMethodType = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS",
  HEAD: "HEAD",
} as const;

export type HTTPMethod = (typeof HTTPMethodType)[keyof typeof HTTPMethodType];
