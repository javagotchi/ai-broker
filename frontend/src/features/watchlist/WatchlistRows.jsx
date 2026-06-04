import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  formatArchivedAt,
  formatCacheStamp,
  formatQuoteMeta,
  simplifyQuoteError,
  toIdeaHex,
} from "./watchlist-formatters.js";

const statusClass = {
  ok: "quote-ok",
  error: "paper-warning",
};

const WatchlistIdeasCell = ({ archived, item, itemIdeas }) => {
  if (archived) {
    return formatArchivedAt(item.archivedAt);
  }

  if (itemIdeas.length === 0) {
    return "";
  }

  return (
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
  );
};

const WatchlistStatusCell = ({ archived, quote }) => {
  if (quote?.status === "ok" && quote.quote) {
    const quoteMeta = formatQuoteMeta(quote.quote);

    return (
      <div className="watchlist-status">
        <div className="watchlist-price">${quote.quote.price.toFixed(2)}</div>
        <div className="quote-meta">
          <span className="provider-chip">{quote.provider || quote.quote.source}</span>
        </div>
        {quoteMeta ? <div className="watchlist-exchange">{quoteMeta}</div> : null}
        {quote.quote.cache?.fetchedAt ? (
          <div className="watchlist-cache">{formatCacheStamp(quote.quote.cache.fetchedAt)}</div>
        ) : null}
      </div>
    );
  }

  if (archived) {
    return <span className="body-muted">Archived</span>;
  }

  return simplifyQuoteError(quote?.error);
};

const WatchlistActionsCell = ({
  archived,
  item,
  onDeleteArchived,
  onMoveToTop,
}) => (
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
);

export const WatchlistRows = ({
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
                <WatchlistIdeasCell archived={archived} item={item} itemIdeas={itemIdeas} />
              </td>
              <td className={statusClass[quote?.status] ?? "body-muted"}>
                <WatchlistStatusCell archived={archived} quote={quote} />
              </td>
              <WatchlistActionsCell
                archived={archived}
                item={item}
                onDeleteArchived={onDeleteArchived}
                onMoveToTop={onMoveToTop}
              />
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);
