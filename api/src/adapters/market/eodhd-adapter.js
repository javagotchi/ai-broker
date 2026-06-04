import { AppError } from "../../lib/errors.js";
import {
  createProviderContext,
  createProviderNotConfiguredError,
} from "./base-market-adapter.js";

const apiBaseUrl = "https://eodhd.com/api/";

const exchangeAliasMap = {
  XETR: "XETRA",
  XTER: "XETRA",
  XFRA: "F",
  FSX: "F",
};

const normalizeExchange = (exchange = "") =>
  exchangeAliasMap[exchange.toUpperCase()] ?? exchange.toUpperCase();

const buildUrl = (path, params) => {
  const url = new URL(path.replace(/^\//, ""), apiBaseUrl);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  return url;
};

const normalizeProviderMessage = (message) => {
  if (!message) {
    return null;
  }

  if (message.includes("Forbidden")) {
    return "EODHD rejected the request for this symbol or plan.";
  }

  return message;
};

const requestJson = async (path, params) => {
  const response = await fetch(buildUrl(path, params), {
    headers: {
      accept: "application/json",
    },
  });

  const text = await response.text();
  let payload = null;

  try {
    payload = text ? JSON.parse(text) : null;
  } catch {
    payload = text;
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload?.message
        ? payload.message
        : typeof payload === "string"
          ? payload
          : `Market data request failed with ${response.status}`;

    throw new AppError(normalizeProviderMessage(message), 502, payload);
  }

  return payload;
};

const toEodhdTicker = ({ ticker, quoteSymbol, exchange }) => {
  const symbol = (ticker || quoteSymbol || "").toUpperCase();
  const normalizedExchange = normalizeExchange(exchange);

  if (!symbol) {
    return "";
  }

  if (symbol.includes(".")) {
    return symbol;
  }

  return normalizedExchange ? `${symbol}.${normalizedExchange}` : symbol;
};

export const createEodhdAdapter = ({ apiKey }) => ({
  name: "EODHD",

  canHandle(item) {
    const context = createProviderContext(item);
    return Boolean(context.exchange || context.ticker.includes("."));
  },

  async getQuote(item) {
    if (!apiKey) {
      throw createProviderNotConfiguredError("EODHD");
    }

    const eodhdTicker = toEodhdTicker(createProviderContext(item));
    const quote = await requestJson(`/real-time/${eodhdTicker}`, {
      api_token: apiKey,
      fmt: "json",
    });

    return {
      symbol: item.ticker || quote.code || eodhdTicker,
      providerSymbol: eodhdTicker,
      name: quote.name || item.companyName || eodhdTicker,
      currency: quote.currency_code || quote.currency || "",
      exchange: quote.exchange || normalizeExchange(item.exchange),
      price: Number(quote.close ?? quote.price),
      change: Number(quote.change ?? 0),
      percentChange: Number(quote.change_p ?? quote.change_percent ?? 0),
      open: Number(quote.open ?? 0),
      high: Number(quote.high ?? 0),
      low: Number(quote.low ?? 0),
      previousClose: Number(quote.previousClose ?? quote.previous_close ?? 0),
      volume: Number(quote.volume ?? 0),
      isMarketOpen: true,
      timestamp: quote.timestamp ? new Date(quote.timestamp * 1000).toISOString() : "",
      source: "EODHD",
    };
  },

  async getDailySeries(item, outputsize = 20) {
    if (!apiKey) {
      throw createProviderNotConfiguredError("EODHD");
    }

    const eodhdTicker = toEodhdTicker(createProviderContext(item));
    const series = await requestJson(`/eod/${eodhdTicker}`, {
      api_token: apiKey,
      fmt: "json",
      period: "d",
      order: "a",
    });

    const values = Array.isArray(series)
      ? series.slice(Math.max(series.length - outputsize, 0)).map((entry) => ({
          date: entry.date,
          open: Number(entry.open),
          high: Number(entry.high),
          low: Number(entry.low),
          close: Number(entry.close),
          volume: Number(entry.volume ?? 0),
        }))
      : [];

    return {
      symbol: item.ticker || eodhdTicker,
      interval: "1day",
      timezone: "",
      values,
      source: "EODHD",
    };
  },
});
