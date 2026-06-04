import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const statusClass = {
  ok: "quote-ok",
  error: "paper-warning",
};

const simplifyError = (message = "") => {
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

const formatQuoteMeta = (quote) => {
  if (!quote) {
    return "";
  }

  const parts = [quote.exchange, quote.currency].filter(Boolean);
  return parts.join(" · ");
};

const formatCacheStamp = (isoString) => {
  if (!isoString) {
    return "";
  }

  const date = new Date(isoString);
  const pad = (value) => String(value).padStart(2, "0");

  return `${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}:${pad(date.getSeconds())}`;
};

const formatArchivedAt = (archivedAt) => {
  if (!archivedAt) {
    return "";
  }

  const date = new Date(archivedAt.replace(" ", "T"));
  return Number.isNaN(date.getTime()) ? archivedAt : date.toLocaleString("de-DE");
};

const toIdeaHex = (id) => Number(id).toString(16).toUpperCase().padStart(2, "0");

const WatchlistRows = ({
  items,
  quotes,
  ideas,
  onSetActive,
  onMoveToTop,
  onDeleteArchived,
  archived = false,
}) => (
  <div className="table-responsive">
    <table className="table newspaper-table align-middle mb-0">
      <thead>
        <tr>
          <th />
          <th>Type</th>
          <th>Ticker</th>
          <th>Company</th>
          <th>Identifiers</th>
          <th>{archived ? "Archived" : "Ideas"}</th>
          <th>Live status</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const quote = quotes.find((entry) => entry.itemId === item.id);
          const itemIdeas = ideas.filter((idea) => idea.watchlistItemId === item.id);
          return (
            <tr key={item.id}>
              <td className="text-center">
                <input
                  type="checkbox"
                  className="paper-checkbox"
                  checked={!archived}
                  onChange={(event) => onSetActive(item.id, event.target.checked)}
                  aria-label={`${archived ? "Restore" : "Archive"} ${item.ticker}`}
                />
              </td>
              <td>{item.assetType || "-"}</td>
              <td className="fw-semibold">{item.ticker}</td>
              <td>{item.companyName || "-"}</td>
              <td className="body-muted">
                {item.wkn ? `WKN ${item.wkn}` : ""}
                {item.wkn && item.isin ? " · " : ""}
                {item.isin ? `ISIN ${item.isin}` : "-"}
              </td>
              <td className="body-muted">
                {archived ? (
                  formatArchivedAt(item.archivedAt)
                ) : itemIdeas.length > 0 ? (
                  <div className="idea-link-list">
                    {itemIdeas.map((idea) => {
                      const ideaHex = toIdeaHex(idea.id);

                      return (
                        <a key={idea.id} className="idea-link" href={`#IDEA_${ideaHex}`}>
                          {ideaHex}
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  ""
                )}
              </td>
              <td className={statusClass[quote?.status] ?? "body-muted"}>
                {quote?.status === "ok" && quote.quote ? (
                  <div className="watchlist-status">
                    <div className="watchlist-price">${quote.quote.price.toFixed(2)}</div>
                    <div className="quote-meta">
                      <span className="provider-chip">
                        {quote.provider || quote.quote.source}
                      </span>
                    </div>
                    {formatQuoteMeta(quote.quote) ? (
                      <div className="watchlist-exchange">{formatQuoteMeta(quote.quote)}</div>
                    ) : null}
                    {quote.quote.cache?.fetchedAt ? (
                      <div className="watchlist-cache">
                        {formatCacheStamp(quote.quote.cache.fetchedAt)}
                      </div>
                    ) : null}
                  </div>
                ) : archived ? (
                  <span className="body-muted">Archived</span>
                ) : (
                  simplifyError(quote?.error)
                )}
              </td>
              <td className="text-end">
                {!archived && item.sortOrder > 1 ? (
                  <button
                    type="button"
                    className="btn btn-sm paper-icon-button"
                    onClick={() => onMoveToTop(item.id)}
                    aria-label={`Move ${item.ticker} to top`}
                    title="Move to top"
                  >
                    <FontAwesomeIcon icon={faArrowUp} className="fa-icon" />
                  </button>
                ) : null}
                {archived ? (
                  <button
                    type="button"
                    className="btn btn-sm paper-icon-button paper-trash-button"
                    onClick={() => onDeleteArchived(item.id)}
                    aria-label={`Delete archived ${item.ticker}`}
                    title="Delete permanently"
                  >
                    <FontAwesomeIcon icon={faTrashCan} className="fa-icon" />
                  </button>
                ) : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export const WatchlistTable = ({
  items,
  archivedItems,
  quotes,
  ideas,
  onSetActive,
  onMoveToTop,
  onDeleteArchived,
}) => (
  <div className="paper-panel p-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <p className="eyebrow mb-1">Watchlist</p>
    
      </div>
    </div>
    <WatchlistRows
      items={items}
      quotes={quotes}
      ideas={ideas}
      onSetActive={onSetActive}
      onMoveToTop={onMoveToTop}
      onDeleteArchived={onDeleteArchived}
    />

    <div className="archive-box mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <p className="eyebrow mb-1">Archive</p>

        </div>
 
      </div>

      {archivedItems.length > 0 ? (
        <WatchlistRows
          items={archivedItems}
          archivedItems={archivedItems}
          quotes={quotes}
          ideas={ideas}
          onSetActive={onSetActive}
          onMoveToTop={onMoveToTop}
          onDeleteArchived={onDeleteArchived}
          archived
        />
      ) : (
        <p className="small body-muted mb-0">No archived positions yet.</p>
      )}
    </div>
  </div>
);
