ALTER TABLE watchlist_ideas ADD COLUMN title TEXT;
ALTER TABLE watchlist_ideas ADD COLUMN objective TEXT;
ALTER TABLE watchlist_ideas ADD COLUMN strategy_type TEXT;
ALTER TABLE watchlist_ideas ADD COLUMN cadence TEXT;
ALTER TABLE watchlist_ideas ADD COLUMN status TEXT;
ALTER TABLE watchlist_ideas ADD COLUMN parameters_json TEXT;
ALTER TABLE watchlist_ideas ADD COLUMN last_run_at TEXT;
ALTER TABLE watchlist_ideas ADD COLUMN next_run_at TEXT;

UPDATE watchlist_ideas
SET
  title = COALESCE(NULLIF(title, ''), 'Untitled idea'),
  objective = COALESCE(NULLIF(objective, ''), thesis),
  strategy_type = COALESCE(NULLIF(strategy_type, ''), 'custom'),
  cadence = COALESCE(NULLIF(cadence, ''), 'weekly'),
  status = COALESCE(NULLIF(status, ''), 'active'),
  parameters_json = COALESCE(parameters_json, '{}')
WHERE
  title IS NULL
  OR objective IS NULL
  OR strategy_type IS NULL
  OR cadence IS NULL
  OR status IS NULL
  OR parameters_json IS NULL;
