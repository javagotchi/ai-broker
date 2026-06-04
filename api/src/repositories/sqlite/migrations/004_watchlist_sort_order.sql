ALTER TABLE watchlist_items ADD COLUMN sort_order INTEGER;

WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC, ticker ASC) AS rn
  FROM watchlist_items
)
UPDATE watchlist_items
SET sort_order = (
  SELECT rn
  FROM ordered
  WHERE ordered.id = watchlist_items.id
)
WHERE sort_order IS NULL;

