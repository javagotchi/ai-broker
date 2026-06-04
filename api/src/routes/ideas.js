import { ok } from "../lib/response.js";

export const registerIdeaRoutes = (app, { ideaService }) => {
  app.get("/api/v1/ideas", () =>
    ok({
      items: ideaService.list(),
    }),
  );

  app.post("/api/v1/ideas", async (c) => {
    const payload = await c.req.json();
    const item = ideaService.create(payload);

    return ok({ item }, 201);
  });

  app.put("/api/v1/ideas/:id", async (c) => {
    const payload = await c.req.json();
    const item = ideaService.update(c.req.param("id"), payload);

    return ok({ item });
  });
};
