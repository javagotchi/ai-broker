import { apiClient } from "./api-client";

export const fetchMarketOverview = (symbol, options = {}) => {
  const params = new URLSearchParams({
    symbol,
  });

  if (options.forceRefresh) {
    params.set("forceRefresh", "1");
  }

  return apiClient.get(`/market/overview?${params.toString()}`);
};

export const fetchWatchlistQuotes = () => apiClient.get("/market/watchlist");
