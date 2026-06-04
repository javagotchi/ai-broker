import { Hono } from "hono";
import { cors } from "hono/cors";
import { createEodhdAdapter } from "../adapters/market/eodhd-adapter.js";
import { createMarketProviderRouter } from "../adapters/market/market-provider-router.js";
import { env } from "../config/env.js";
import { createTwelveDataAdapter } from "../adapters/market/twelve-data-adapter.js";
import { db } from "../lib/db.js";
import { toErrorResponse } from "../lib/errors.js";
import { createMarketCacheRepository } from "../repositories/sqlite/market-cache-repository.js";
import { createIdeaRepository } from "../repositories/sqlite/idea-repository.js";
import { createWatchlistRepository } from "../repositories/sqlite/watchlist-repository.js";
import { registerHealthRoutes } from "../routes/health.js";
import { registerIdeaRoutes } from "../routes/ideas.js";
import { registerMarketRoutes } from "../routes/market.js";
import { registerWatchlistRoutes } from "../routes/watchlist.js";
import { createIdeaService } from "../services/idea-service.js";
import { createMarketCacheService } from "../services/market-cache-service.js";
import { createMarketService } from "../services/market-service.js";
import { createWatchlistService } from "../services/watchlist-service.js";

export const createApp = () => {
  const app = new Hono();

  app.use(
    "*",
    cors({
      origin: env.allowedOrigin,
    }),
  );

  const watchlistRepository = createWatchlistRepository(db);
  const watchlistService = createWatchlistService({
    repository: watchlistRepository,
  });
  const ideaRepository = createIdeaRepository(db);
  const ideaService = createIdeaService({
    repository: ideaRepository,
    watchlistRepository,
  });
  const marketCacheRepository = createMarketCacheRepository(db);
  const marketCacheService = createMarketCacheService({
    repository: marketCacheRepository,
    enabled: env.marketCacheEnabled,
    quoteTtlSeconds: env.quoteCacheTtlSeconds,
    seriesTtlSeconds: env.seriesCacheTtlSeconds,
  });
  const twelveDataAdapter = createTwelveDataAdapter({
    apiKey: env.twelveDataApiKey,
  });
  const eodhdAdapter = createEodhdAdapter({
    apiKey: env.eodhdApiKey,
  });
  const marketRouter = createMarketProviderRouter({
    providers: [twelveDataAdapter, eodhdAdapter],
    defaultSymbol: env.defaultSymbol,
  });
  const marketService = createMarketService({
    router: marketRouter,
    cache: marketCacheService,
    watchlistService,
    defaultSymbol: env.defaultSymbol,
  });

  registerHealthRoutes(app);
  registerWatchlistRoutes(app, { watchlistService });
  registerIdeaRoutes(app, { ideaService });
  registerMarketRoutes(app, { marketService, watchlistService });

  app.onError((error) => {
    const { status, body } = toErrorResponse(error);
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "content-type": "application/json; charset=utf-8",
      },
    });
  });

  return app;
};
