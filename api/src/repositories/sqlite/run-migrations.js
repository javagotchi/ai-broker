import fs from "node:fs";
import path from "node:path";

export const runMigrations = (db) => {
  const migrationsDir = path.resolve(
    process.cwd(),
    "src",
    "repositories",
    "sqlite",
    "migrations",
  );

  db.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const applied = new Set(
    db.prepare("SELECT filename FROM schema_migrations").all().map((row) => row.filename),
  );

  const files = fs
    .readdirSync(migrationsDir)
    .filter((filename) => filename.endsWith(".sql"))
    .sort();

  for (const filename of files) {
    if (applied.has(filename)) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, filename), "utf8");
    db.exec(sql);
    db.prepare("INSERT INTO schema_migrations (filename) VALUES (?)").run(filename);
  }
};

