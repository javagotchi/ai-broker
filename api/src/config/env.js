import fs from "node:fs";
import path from "node:path";

const workspaceRoot = path.resolve(process.cwd(), "..");
const runtimeEnvPath = process.env.RUNTIME_ENV_PATH ?? path.join(process.cwd(), ".env.runtime");

const parseEnvFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  const values = {};

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    values[key] = rawValue;
  }

  return values;
};

const fileEnv = parseEnvFile(runtimeEnvPath);
const readEnv = (key, fallback) => fileEnv[key] ?? process.env[key] ?? fallback;
const readNumberEnv = (key, fallback) => Number(readEnv(key, fallback));
const readBooleanEnv = (key, fallback = false) =>
  String(readEnv(key, fallback ? "true" : "false")).toLowerCase() === "true";

export const env = {
  nodeEnv: readEnv("NODE_ENV", "development"),
  port: readNumberEnv("API_PORT", 3001),
  allowedOrigin: readEnv("ALLOWED_ORIGIN", "*"),
  databasePath:
    readEnv("DATABASE_PATH") ??
    path.join(workspaceRoot, "data", "sqlite", "broker.db"),
  twelveDataApiKey: readEnv("TWELVEDATA_API_KEY", "demo"),
  eodhdApiKey: readEnv("EODHD_API_KEY", ""),
  defaultSymbol: readEnv("DEFAULT_SYMBOL", "AAPL"),
  marketCacheEnabled: readBooleanEnv("MARKET_CACHE_ENABLED", false),
  quoteCacheTtlSeconds: readNumberEnv("QUOTE_CACHE_TTL_SECONDS", 900),
  seriesCacheTtlSeconds: readNumberEnv("SERIES_CACHE_TTL_SECONDS", 21600),
};
