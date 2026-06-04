import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { env } from "../config/env.js";
import { runMigrations } from "../repositories/sqlite/run-migrations.js";

const databaseDir = path.dirname(env.databasePath);
fs.mkdirSync(databaseDir, { recursive: true });

const db = new Database(env.databasePath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

runMigrations(db);

export { db };
