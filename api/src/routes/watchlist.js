import { ok } from "../lib/response.js";

export const registerWatchlistRoutes = (app, { watchlistService }) => {
  app.get("/api/v1/watchlist", () =>
    ok({
      items: watchlistService.list(),
    }),
  );

  app.post("/api/v1/watchlist", async (c) => {
    const payload = await c.req.json();
    const item = watchlistService.create(payload);

    return ok({ item }, 201);
  });

  app.post("/api/v1/watchlist/:id/move-to-top", (c) => {
    const item = watchlistService.moveToTop(c.req.param("id"));
    return ok({ item });
  });

  app.post("/api/v1/watchlist/:id/active", async (c) => {
    const payload = await c.req.json();
    const item = watchlistService.setActive(c.req.param("id"), payload.active === true);
    return ok({ item });
  });

  app.delete("/api/v1/watchlist/:id", (c) => {
    watchlistService.removeArchived(c.req.param("id"));
    return ok({ status: "deleted" });
  });
};
