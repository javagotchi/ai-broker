CREATE TABLE IF NOT EXISTS watchlist_ideas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  watchlist_item_id INTEGER NOT NULL,
  thesis TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (watchlist_item_id) REFERENCES watchlist_items(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_watchlist_ideas_item_created_at
ON watchlist_ideas (watchlist_item_id, created_at DESC);
