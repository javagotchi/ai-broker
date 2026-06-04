import { ok } from "../lib/response.js";

export const registerHealthRoutes = (app) => {
  app.get("/api/v1/health", (c) =>
    ok({
      status: "ok",
      service: "ai-broker-api",
      now: new Date().toISOString(),
    }),
  );
};

