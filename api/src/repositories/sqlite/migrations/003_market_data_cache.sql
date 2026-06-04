CREATE TABLE IF NOT EXISTS market_data_cache (
  cache_key TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  provider TEXT,
  symbol TEXT NOT NULL,
  exchange TEXT,
  fetched_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_market_data_cache_kind_expires_at
ON market_data_cache (kind, expires_at);

