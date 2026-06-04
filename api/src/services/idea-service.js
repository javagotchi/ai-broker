import { z } from "zod";
import { AppError } from "../lib/errors.js";

const createIdeaSchema = z.object({
  watchlistItemId: z.number().int().positive(),
  title: z.string().trim().min(1).max(120),
  objective: z.string().trim().min(1).max(1000),
  status: z.enum(["active", "paused", "draft"]).default("active"),
  startDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")).default(""),
  endDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")).default(""),
  parametersJson: z.string().trim().optional().default("{}"),
  lastRunAt: z.string().trim().optional().nullable().default(null),
  nextRunAt: z.string().trim().optional().nullable().default(null),
});

export const createIdeaService = ({ repository, watchlistRepository }) => ({
  list() {
    return repository.list();
  },

  create(payload) {
    const parsed = validateIdeaPayload(payload, watchlistRepository);

    return repository.create(parsed);
  },

  update(id, payload) {
    const numericId = Number(id);

    if (!Number.isInteger(numericId) || numericId <= 0) {
      throw new AppError("Invalid idea id", 400);
    }

    const parsed = validateIdeaPayload(payload, watchlistRepository);
    const item = repository.update(numericId, parsed);

    if (!item) {
      throw new AppError("Idea not found", 404);
    }

    return item;
  },
});

const validateIdeaPayload = (payload, watchlistRepository) => {
  const parsed = createIdeaSchema.safeParse(payload);

  if (!parsed.success) {
    throw new AppError("Invalid idea payload", 400, parsed.error.flatten());
  }

  const watchlistItem = watchlistRepository.findById(parsed.data.watchlistItemId);

  if (!watchlistItem || watchlistItem.archivedAt) {
    throw new AppError("Active watchlist item not found", 404);
  }

  if (parsed.data.startDate && parsed.data.endDate && parsed.data.endDate < parsed.data.startDate) {
    throw new AppError("End date must be on or after start date", 400);
  }

  return {
    ...parsed.data,
    startDate: parsed.data.startDate || null,
    endDate: parsed.data.endDate || null,
    parametersJson: parsed.data.parametersJson || "{}",
  };
};
