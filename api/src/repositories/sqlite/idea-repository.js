export const createIdeaRepository = (db) => ({
  list() {
    return db
      .prepare(
        `SELECT
           ideas.id,
           ideas.watchlist_item_id AS watchlistItemId,
           items.ticker,
           items.company_name AS companyName,
           ideas.title,
           ideas.objective,
           ideas.start_date AS startDate,
           ideas.end_date AS endDate,
           ideas.status,
           ideas.parameters_json AS parametersJson,
           ideas.last_run_at AS lastRunAt,
           ideas.next_run_at AS nextRunAt,
           ideas.thesis,
           ideas.created_at AS createdAt
         FROM watchlist_ideas ideas
         INNER JOIN watchlist_items items
           ON items.id = ideas.watchlist_item_id
         WHERE items.archived_at IS NULL
         ORDER BY ideas.created_at DESC, ideas.id DESC`,
      )
      .all();
  },

  create(input) {
    const result = db
      .prepare(
        `INSERT INTO watchlist_ideas (
           watchlist_item_id,
           thesis,
           title,
           objective,
           strategy_type,
           cadence,
           status,
           parameters_json,
           last_run_at,
           next_run_at,
           start_date,
           end_date
         ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        input.watchlistItemId,
        input.objective,
        input.title,
        input.objective,
        "custom",
        null,
        input.status,
        input.parametersJson,
        input.lastRunAt,
        input.nextRunAt,
        input.startDate,
        input.endDate,
      );

    return this.findById(result.lastInsertRowid);
  },

  update(id, input) {
    const result = db
      .prepare(
        `UPDATE watchlist_ideas
         SET
           watchlist_item_id = ?,
           thesis = ?,
           title = ?,
           objective = ?,
           status = ?,
           parameters_json = ?,
           last_run_at = ?,
           next_run_at = ?,
           start_date = ?,
           end_date = ?
         WHERE id = ?`,
      )
      .run(
        input.watchlistItemId,
        input.objective,
        input.title,
        input.objective,
        input.status,
        input.parametersJson,
        input.lastRunAt,
        input.nextRunAt,
        input.startDate,
        input.endDate,
        id,
      );

    if (result.changes === 0) {
      return null;
    }

    return this.findById(id);
  },

  findById(id) {
    return db
      .prepare(
        `SELECT
           ideas.id,
           ideas.watchlist_item_id AS watchlistItemId,
           items.ticker,
           items.company_name AS companyName,
           ideas.title,
           ideas.objective,
           ideas.start_date AS startDate,
           ideas.end_date AS endDate,
           ideas.status,
           ideas.parameters_json AS parametersJson,
           ideas.last_run_at AS lastRunAt,
           ideas.next_run_at AS nextRunAt,
           ideas.thesis,
           ideas.created_at AS createdAt
         FROM watchlist_ideas ideas
         INNER JOIN watchlist_items items
           ON items.id = ideas.watchlist_item_id
         WHERE ideas.id = ?`,
      )
      .get(id);
  },
});
