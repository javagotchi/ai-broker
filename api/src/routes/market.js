import { ok } from "../lib/response.js";

export const registerMarketRoutes = (app, { marketService, watchlistService }) => {
  app.get("/api/v1/market/overview", async (c) => {
    const symbol = c.req.query("symbol");
    const forceRefresh = ["1", "true", "yes"].includes(
      String(c.req.query("forceRefresh") ?? "").toLowerCase(),
    );

    return ok(await marketService.getOverview(symbol, { forceRefresh }));
  });

  app.get("/api/v1/market/watchlist", async () => {
    const items = watchlistService
      .list()
      .filter((item) => !item.archivedAt)
      .slice(0, 12);
    return ok(await marketService.getBatchForWatchlist(items));
  });
};
