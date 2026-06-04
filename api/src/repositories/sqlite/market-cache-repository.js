export const createMarketCacheRepository = (db) => ({
  findByKey(cacheKey) {
    const row = db
      .prepare(
        `SELECT
           cache_key AS cacheKey,
           kind,
           payload_json AS payloadJson,
           provider,
           symbol,
           exchange,
           fetched_at AS fetchedAt,
           expires_at AS expiresAt,
           updated_at AS updatedAt
         FROM market_data_cache
         WHERE cache_key = ?`,
      )
      .get(cacheKey);

    if (!row) {
      return null;
    }

    return {
      ...row,
      payload: JSON.parse(row.payloadJson),
    };
  },

  upsert(entry) {
    db.prepare(
      `INSERT INTO market_data_cache (
         cache_key,
         kind,
         payload_json,
         provider,
         symbol,
         exchange,
         fetched_at,
         expires_at,
         updated_at
       ) VALUES (
         @cacheKey,
         @kind,
         @payloadJson,
         @provider,
         @symbol,
         @exchange,
         @fetchedAt,
         @expiresAt,
         CURRENT_TIMESTAMP
       )
       ON CONFLICT(cache_key) DO UPDATE SET
         payload_json = excluded.payload_json,
         provider = excluded.provider,
         symbol = excluded.symbol,
         exchange = excluded.exchange,
         fetched_at = excluded.fetched_at,
         expires_at = excluded.expires_at,
         updated_at = CURRENT_TIMESTAMP`,
    ).run({
      ...entry,
      payloadJson: JSON.stringify(entry.payload),
    });
  },
});

