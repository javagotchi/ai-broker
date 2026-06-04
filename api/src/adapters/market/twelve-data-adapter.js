import { AppError } from "../../lib/errors.js";
import {
  createProviderContext,
  createProviderNotConfiguredError,
} from "./base-market-adapter.js";

const apiBaseUrl = "https://api.twelvedata.com";

const normalizeProviderMessage = (message) => {
  if (!message) {
    return null;
  }

  if (message.includes("demo") && message.includes("API key")) {
    return "Demo key limit reached for this symbol. Set TWELVEDATA_API_KEY to your own free key.";
  }

  return message;
};

const buildUrl = (path, params) => {
  const url = new URL(path, apiBaseUrl);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  return url;
};

const requestJson = async (path, params) => {
  const response = await fetch(buildUrl(path, params), {
    headers: {
      accept: "application/json",
    },
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new AppError(
      normalizeProviderMessage(payload.message) ??
        `Market data request failed with ${response.status}`,
      502,
      payload,
    );
  }

  if (payload.status === "error" || payload.code) {
    throw new AppError(
      normalizeProviderMessage(payload.message) ?? "Market data provider rejected the request",
      502,
      payload,
    );
  }

  return payload;
};

export const createTwelveDataAdapter = ({ apiKey }) => ({
  name: "TwelveData",

  canHandle(item) {
    const context = createProviderContext(item);
    return Boolean(context.ticker || context.quoteSymbol);
  },

  async getQuote(symbol) {
    const context = createProviderContext(
      typeof symbol === "string" ? { ticker: symbol } : symbol,
    );

    if (!apiKey) {
      throw createProviderNotConfiguredError("TwelveData");
    }

    const quote = await requestJson("/quote", {
      symbol: (context.quoteSymbol || context.ticker).toUpperCase(),
      apikey: apiKey,
    });

    return {
      symbol: quote.symbol,
      name: quote.name,
      currency: quote.currency,
      exchange: quote.exchange,
      price: Number(quote.close),
      change: Number(quote.change),
      percentChange: Number(quote.percent_change),
      open: Number(quote.open),
      high: Number(quote.high),
      low: Number(quote.low),
      previousClose: Number(quote.previous_close),
      volume: Number(quote.volume),
      isMarketOpen: Boolean(quote.is_market_open),
      timestamp: quote.datetime,
      source: "TwelveData",
    };
  },

  async getDailySeries(symbol, outputsize = 20) {
    const context = createProviderContext(
      typeof symbol === "string" ? { ticker: symbol } : symbol,
    );

    if (!apiKey) {
      throw createProviderNotConfiguredError("TwelveData");
    }

    const series = await requestJson("/time_series", {
      symbol: (context.quoteSymbol || context.ticker).toUpperCase(),
      interval: "1day",
      outputsize,
      apikey: apiKey,
    });

    return {
      symbol: series.meta.symbol,
      interval: series.meta.interval,
      timezone: series.meta.exchange_timezone,
      values: series.values
        .map((entry) => ({
          date: entry.datetime,
          open: Number(entry.open),
          high: Number(entry.high),
          low: Number(entry.low),
          close: Number(entry.close),
          volume: Number(entry.volume),
        }))
        .reverse(),
      source: "TwelveData",
    };
  },
});
