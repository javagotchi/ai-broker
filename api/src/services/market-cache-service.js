const toIso = (date) => date.toISOString();

const addSeconds = (date, seconds) => new Date(date.getTime() + seconds * 1000);

const isExpired = (isoString) => new Date(isoString).getTime() <= Date.now();

export const createMarketCacheService = ({
  repository,
  enabled,
  quoteTtlSeconds,
  seriesTtlSeconds,
}) => {
  let cacheHealthy = true;

  const buildKey = ({ kind, item, outputsize = "" }) => {
    const exchange = (item.exchange || "").toUpperCase();
    const providerSymbol = (item.quoteSymbol || item.ticker || "").toUpperCase();
    return [kind, providerSymbol, exchange, outputsize].join(":");
  };

  const read = ({ kind, item, outputsize }) => {
    if (!enabled || !cacheHealthy) {
      return null;
    }

    const cacheKey = buildKey({ kind, item, outputsize });
    let entry = null;

    try {
      entry = repository.findByKey(cacheKey);
    } catch {
      cacheHealthy = false;
      return null;
    }

    if (!entry) {
      return null;
    }

    return {
      key: cacheKey,
      provider: entry.provider,
      payload: entry.payload,
      fetchedAt: entry.fetchedAt,
      expiresAt: entry.expiresAt,
      isFresh: !isExpired(entry.expiresAt),
      isStale: isExpired(entry.expiresAt),
    };
  };

  const write = ({ kind, item, outputsize, provider, payload }) => {
    if (!enabled || !cacheHealthy) {
      return {
        key: buildKey({ kind, item, outputsize }),
        payload,
        provider,
        fetchedAt: "",
        expiresAt: "",
        isFresh: false,
        isStale: false,
      };
    }

    const now = new Date();
    const ttlSeconds = kind === "series" ? seriesTtlSeconds : quoteTtlSeconds;
    const cacheKey = buildKey({ kind, item, outputsize });

    try {
      repository.upsert({
        cacheKey,
        kind,
        provider,
        symbol: (item.quoteSymbol || item.ticker || "").toUpperCase(),
        exchange: (item.exchange || "").toUpperCase(),
        fetchedAt: toIso(now),
        expiresAt: toIso(addSeconds(now, ttlSeconds)),
        payload,
      });
    } catch {
      cacheHealthy = false;
      return {
        key: cacheKey,
        payload,
        provider,
        fetchedAt: "",
        expiresAt: "",
        isFresh: false,
        isStale: false,
      };
    }

    return {
      key: cacheKey,
      payload,
      provider,
      fetchedAt: toIso(now),
      expiresAt: toIso(addSeconds(now, ttlSeconds)),
      isFresh: true,
      isStale: false,
    };
  };

  return {
    enabled,

    getQuote(item) {
      return read({ kind: "quote", item });
    },

    setQuote(item, provider, payload) {
      return write({ kind: "quote", item, provider, payload });
    },

    getSeries(item, outputsize) {
      return read({ kind: "series", item, outputsize });
    },

    setSeries(item, outputsize, provider, payload) {
      return write({ kind: "series", item, outputsize, provider, payload });
    },
  };
};
