ALTER TABLE watchlist_items ADD COLUMN asset_type TEXT;
ALTER TABLE watchlist_items ADD COLUMN wkn TEXT;
ALTER TABLE watchlist_items ADD COLUMN isin TEXT;
ALTER TABLE watchlist_items ADD COLUMN exchange TEXT;
ALTER TABLE watchlist_items ADD COLUMN quote_symbol TEXT;

DELETE FROM watchlist_items WHERE ticker IN ('AAPL', 'MSFT');

INSERT OR IGNORE INTO watchlist_items (
  ticker,
  quote_symbol,
  exchange,
  asset_type,
  company_name,
  wkn,
  isin,
  thesis
)
VALUES
  (
    'XDWT',
    'XDWT',
    'XETR',
    'ETF',
    'Xtrackers MSCI World Information Technology UCITS ETF 1C',
    'A113FM',
    'IE00BM67HT60',
    'Startposition aus dem bestehenden Portfolio; XETR-Listing ist auf dem aktuellen TwelveData-Plan nicht freigeschaltet.'
  ),
  (
    'IFX',
    'IFNNF',
    'XETR',
    'Stock',
    'Infineon Technologies AG',
    '623100',
    'DE0006231004',
    'Startposition aus dem bestehenden Portfolio; Live-Quote laeuft als Fallback ueber OTC-Symbol IFNNF.'
  );

