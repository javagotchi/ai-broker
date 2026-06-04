import { AppError } from "../lib/errors.js";

const normalizeOverviewItem = (symbol) => ({
  ticker: symbol.toUpperCase(),
  quoteSymbol: symbol.toUpperCase(),
  exchange: "",
});

export const createMarketService = ({
  router,
  cache,
  watchlistService,
  defaultSymbol,
}) => ({
  async getOverview(symbol = defaultSymbol, options = {}) {
    const forceRefresh = options.forceRefresh === true;
    const targetTicker = symbol.toUpperCase();
    const watchlistItem = watchlistService
      .list()
      .find((item) => item.ticker.toUpperCase() === targetTicker);

    const item = watchlistItem ?? normalizeOverviewItem(symbol);

    const cachedQuote =
      cache.enabled && !forceRefresh ? cache.getQuote(item) : null;
    const cachedSeries =
      cache.enabled && !forceRefresh ? cache.getSeries(item, 20) : null;

    if (cachedQuote?.isFresh && cachedSeries?.isFresh) {
      return {
        symbol: item.ticker,
        asOf: cachedQuote.payload.timestamp,
        source: cachedQuote.payload.source,
        sourceDetail: {
          quote: cachedQuote.provider,
          series: cachedSeries.provider,
        },
        quote: {
          ...cachedQuote.payload,
          cache: {
            hit: true,
            stale: false,
            fetchedAt: cachedQuote.fetchedAt,
          },
        },
        series: cachedSeries.payload.values,
        notes: "Served from local cache first to reduce provider usage.",
      };
    }

    try {
      const overview = await router.getOverviewForItem(item);
      const quoteEntry = cache.enabled
        ? cache.setQuote(item, overview.sourceDetail.quote, overview.quote)
        : null;
      const seriesEntry = cache.enabled
        ? cache.setSeries(item, 20, overview.sourceDetail.series, {
            values: overview.series,
          })
        : null;

      return {
        ...overview,
        quote: {
          ...overview.quote,
          cache: cache.enabled && !forceRefresh
            ? {
                hit: false,
                stale: false,
                fetchedAt: quoteEntry.fetchedAt,
              }
            : forceRefresh
              ? {
                  hit: false,
                  bypassed: true,
                  fetchedAt: quoteEntry?.fetchedAt ?? new Date().toISOString(),
                }
            : {
                hit: false,
                disabled: true,
              },
        },
        notes: forceRefresh
          ? "Fresh provider fetch. Cache bypassed."
          : cache.enabled
            ? "Cache miss. Data refreshed from provider and stored locally."
            : "Cache is disabled. Data refreshed directly from provider.",
        series: seriesEntry?.payload.values ?? overview.series,
      };
    } catch (error) {
      if (!forceRefresh && cachedQuote && cachedSeries) {
        return {
          symbol: item.ticker,
          asOf: cachedQuote.payload.timestamp,
          source: cachedQuote.payload.source,
          sourceDetail: {
            quote: cachedQuote.provider,
            series: cachedSeries.provider,
          },
          quote: {
            ...cachedQuote.payload,
            cache: {
              hit: true,
              stale: true,
              fetchedAt: cachedQuote.fetchedAt,
            },
          },
          series: cachedSeries.payload.values,
          notes: "Provider refresh failed. Returned stale cached data.",
        };
      }

      throw error;
    }
  },

  async getBatchForWatchlist(items) {
    const results = [];

    for (const item of items) {
      const cachedQuote = cache.enabled ? cache.getQuote(item) : null;

      if (cachedQuote?.isFresh) {
        results.push({
          itemId: item.id,
          ticker: item.ticker,
          requestedSymbol: item.quoteSymbol || item.ticker,
          provider: cachedQuote.provider,
          status: "ok",
          quote: {
            ...cachedQuote.payload,
            cache: {
              hit: true,
              stale: false,
              fetchedAt: cachedQuote.fetchedAt,
            },
          },
        });
        continue;
      }

      try {
        const { provider, quote } = await router.getQuoteForItem(item);
        const cacheEntry = cache.setQuote(item, provider, quote);
        results.push({
          itemId: item.id,
          ticker: item.ticker,
          requestedSymbol: item.quoteSymbol || item.ticker,
          provider,
          status: "ok",
          quote: {
            ...quote,
            cache: cache.enabled
              ? {
                  hit: false,
                  stale: false,
                  fetchedAt: cacheEntry.fetchedAt,
                }
              : {
                  hit: false,
                  disabled: true,
                },
          },
        });
      } catch (error) {
        if (cachedQuote) {
          results.push({
            itemId: item.id,
            ticker: item.ticker,
            requestedSymbol: item.quoteSymbol || item.ticker,
            provider: cachedQuote.provider,
            status: "ok",
            quote: {
              ...cachedQuote.payload,
              cache: {
                hit: true,
                stale: true,
                fetchedAt: cachedQuote.fetchedAt,
              },
            },
            warning: "Provider refresh failed. Returned stale cached quote.",
          });
          continue;
        }

        const appError =
          error instanceof AppError
            ? error
            : new AppError("Unable to load quote", 502, {
                symbol: item.quoteSymbol || item.ticker,
              });

        results.push({
          itemId: item.id,
          ticker: item.ticker,
          requestedSymbol: item.quoteSymbol || item.ticker,
          status: "error",
          error: appError.message,
          details: appError.details,
        });
      }
    }

    return {
      source: "multi-provider",
      items: results,
    };
  },
});
