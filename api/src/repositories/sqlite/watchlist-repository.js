export const createWatchlistRepository = (db) => ({
  list() {
    return db
      .prepare(
        `SELECT
           id,
           sort_order AS sortOrder,
           ticker,
           quote_symbol AS quoteSymbol,
           exchange,
           asset_type AS assetType,
           company_name AS companyName,
           wkn,
           isin,
           thesis,
           archived_at AS archivedAt,
           created_at AS createdAt
         FROM watchlist_items
         ORDER BY
           CASE WHEN archived_at IS NULL THEN 0 ELSE 1 END ASC,
           sort_order ASC,
           archived_at DESC,
           created_at ASC,
           ticker ASC`,
      )
      .all();
  },

  create(input) {
    const nextSortOrder =
      db.prepare("SELECT COALESCE(MAX(sort_order), 0) + 1 AS nextSortOrder FROM watchlist_items").get()
        .nextSortOrder;
    const statement = db.prepare(
      `INSERT INTO watchlist_items (
         sort_order,
         ticker,
         quote_symbol,
         exchange,
           asset_type,
           company_name,
           wkn,
           isin,
           thesis,
           archived_at
       ) VALUES (
         @sortOrder,
         @ticker,
         @quoteSymbol,
         @exchange,
         @assetType,
         @companyName,
         @wkn,
         @isin,
         @thesis,
         NULL
       )`,
    );

    const result = statement.run({
      ...input,
      sortOrder: nextSortOrder,
    });
    return this.findById(result.lastInsertRowid);
  },

  findById(id) {
    return db
      .prepare(
        `SELECT
           id,
           sort_order AS sortOrder,
           ticker,
           quote_symbol AS quoteSymbol,
           exchange,
           asset_type AS assetType,
           company_name AS companyName,
           wkn,
           isin,
           thesis,
           archived_at AS archivedAt,
           created_at AS createdAt
         FROM watchlist_items
         WHERE id = ?`,
      )
      .get(id);
  },

  moveToTop(id) {
    const findById = (targetId) =>
      db
        .prepare(
          `SELECT
             id,
             sort_order AS sortOrder,
             ticker,
             quote_symbol AS quoteSymbol,
             exchange,
             asset_type AS assetType,
             company_name AS companyName,
             wkn,
             isin,
             thesis,
             archived_at AS archivedAt,
             created_at AS createdAt
           FROM watchlist_items
           WHERE id = ?`,
        )
        .get(targetId);

    const transaction = db.transaction((targetId) => {
      const current = db
        .prepare(
          "SELECT id, sort_order AS sortOrder, archived_at AS archivedAt FROM watchlist_items WHERE id = ?",
        )
        .get(targetId);

      if (!current || current.archivedAt) {
        return null;
      }

      db.prepare(
        `UPDATE watchlist_items
         SET sort_order = sort_order + 1
         WHERE sort_order < ?`,
      ).run(current.sortOrder);

      db.prepare(
        `UPDATE watchlist_items
         SET sort_order = 1
         WHERE id = ?`,
      ).run(targetId);

      return findById(targetId);
    });

    return transaction(id);
  },

  setActive(id, active) {
    const transaction = db.transaction((targetId, nextActive) => {
      const current = db
        .prepare(
          `SELECT
             id,
             sort_order AS sortOrder,
             archived_at AS archivedAt
           FROM watchlist_items
           WHERE id = ?`,
        )
        .get(targetId);

      if (!current) {
        return null;
      }

      if (nextActive) {
        db.prepare(
          `UPDATE watchlist_items
           SET archived_at = NULL
           WHERE id = ?`,
        ).run(targetId);
      } else {
        db.prepare(
          `UPDATE watchlist_items
           SET archived_at = CURRENT_TIMESTAMP
           WHERE id = ?`,
        ).run(targetId);
      }

      return this.findById(targetId);
    });

    return transaction(id, active);
  },

  removeArchived(id) {
    const current = db
      .prepare(
        `SELECT id, archived_at AS archivedAt
         FROM watchlist_items
         WHERE id = ?`,
      )
      .get(id);

    if (!current || !current.archivedAt) {
      return null;
    }

    return db.prepare("DELETE FROM watchlist_items WHERE id = ?").run(id);
  },
});
