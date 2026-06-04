import { z } from "zod";
import { AppError } from "../lib/errors.js";

const createWatchlistSchema = z.object({
  ticker: z.string().trim().min(1).max(10),
  quoteSymbol: z.string().trim().max(20).optional().default(""),
  exchange: z.string().trim().max(20).optional().default(""),
  assetType: z.string().trim().max(20).optional().default("Stock"),
  companyName: z.string().trim().max(120).optional().default(""),
  wkn: z.string().trim().max(12).optional().default(""),
  isin: z.string().trim().max(24).optional().default(""),
  thesis: z.string().trim().max(240).optional().default(""),
});

export const createWatchlistService = ({ repository }) => ({
  list() {
    return repository.list();
  },

  create(payload) {
    const parsed = createWatchlistSchema.safeParse(payload);

    if (!parsed.success) {
      throw new AppError("Invalid watchlist payload", 400, parsed.error.flatten());
    }

    try {
      return repository.create({
        sortOrder: undefined,
        ...parsed.data,
        ticker: parsed.data.ticker.toUpperCase(),
        quoteSymbol: parsed.data.quoteSymbol.toUpperCase(),
        exchange: parsed.data.exchange.toUpperCase(),
        wkn: parsed.data.wkn.toUpperCase(),
        isin: parsed.data.isin.toUpperCase(),
      });
    } catch (error) {
      if (String(error.message).includes("UNIQUE")) {
        throw new AppError("Ticker already exists in watchlist", 409);
      }

      throw error;
    }
  },

  moveToTop(id) {
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new AppError("Invalid watchlist id", 400);
    }

    const item = repository.moveToTop(numericId);

    if (!item) {
      throw new AppError("Watchlist item not found", 404);
    }

    return item;
  },

  setActive(id, active) {
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new AppError("Invalid watchlist id", 400);
    }

    const item = repository.setActive(numericId, active);

    if (!item) {
      throw new AppError("Watchlist item not found", 404);
    }

    return item;
  },

  removeArchived(id) {
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new AppError("Invalid watchlist id", 400);
    }

    const result = repository.removeArchived(numericId);

    if (!result || result.changes === 0) {
      throw new AppError("Archived watchlist item not found", 404);
    }
  },
});
