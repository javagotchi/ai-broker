CREATE TABLE IF NOT EXISTS watchlist_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ticker TEXT NOT NULL UNIQUE,
  company_name TEXT,
  thesis TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO watchlist_items (ticker, company_name, thesis)
VALUES
  ('AAPL', 'Apple Inc.', 'Default symbol for the live demo feed'),
  ('MSFT', 'Microsoft Corp.', 'Requires a personal TwelveData key for live quotes');

