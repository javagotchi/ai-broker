import { AppError } from "../../lib/errors.js";

export const createProviderNotConfiguredError = (provider) =>
  new AppError(`${provider} is not configured. Set the matching API key.`, 503, {
    provider,
  });

export const createProviderContext = (item = {}) => ({
  item,
  ticker: item.ticker ?? "",
  quoteSymbol: item.quoteSymbol ?? "",
  exchange: item.exchange ?? "",
  assetType: item.assetType ?? "",
});

