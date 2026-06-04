export const EMPTY_IDEA_FORM = {
  id: null,
  watchlistItemId: "",
  title: "",
  objective: "",
  startDate: "",
  endDate: "",
};

export const toIdeaHex = (id) => Number(id).toString(16).toUpperCase().padStart(2, "0");

export const formatOutcomeValue = (value) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "0$";
  }

  return `${value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}$`;
};

export const formatIdeaTimestamp = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString("de-DE");
};

export const formatArchivedAt = (archivedAt) => {
  if (!archivedAt) {
    return "";
  }

  const date = new Date(archivedAt.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? archivedAt : date.toLocaleString("de-DE");
};

export const simplifyQuoteError = (message = "") => {
  if (message.includes("No market data provider could satisfy the request")) {
    return "No provider available for this instrument.";
  }

  if (message.includes("API credits")) {
    return "Provider rate limit reached.";
  }

  if (message.includes("not configured")) {
    return "Provider key missing.";
  }

  if (message.includes("Grow or Venture plan")) {
    return "Symbol not included in current provider plan.";
  }

  return message || "No quote available.";
};

export const formatQuoteMeta = (quote) => {
  if (!quote) {
    return "";
  }

  return [quote.exchange, quote.currency].filter(Boolean).join(" · ");
};

export const formatCacheStamp = (isoString) => {
  if (!isoString) {
    return "";
  }

  const date = new Date(isoString);
  const pad = (value) => String(value).padStart(2, "0");

  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`;
};

export const buildSuggestedIdeaTitle = (ideas, ticker, excludedIdeaId = null) => {
  const baseTitle = `${ticker} idea`;
  const existingTitles = new Set(
    ideas
      .filter((idea) => idea.id !== excludedIdeaId)
      .map((idea) => idea.title?.trim().toLowerCase())
      .filter(Boolean),
  );

  if (!existingTitles.has(baseTitle.toLowerCase())) {
    return baseTitle;
  }

  let suffix = 2;
  while (existingTitles.has(`${baseTitle} ${suffix}`.toLowerCase())) {
    suffix += 1;
  }

  return `${baseTitle} ${suffix}`;
};
