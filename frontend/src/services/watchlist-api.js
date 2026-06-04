import { apiClient } from "./api-client";

export const fetchWatchlist = () => apiClient.get("/watchlist");

export const createWatchlistItem = (payload) => apiClient.post("/watchlist", payload);

export const moveWatchlistItemToTop = (id) =>
  apiClient.post(`/watchlist/${id}/move-to-top`, {});

export const setWatchlistItemActive = (id, active) =>
  apiClient.post(`/watchlist/${id}/active`, { active });

export const deleteArchivedWatchlistItem = (id) => apiClient.delete(`/watchlist/${id}`);
