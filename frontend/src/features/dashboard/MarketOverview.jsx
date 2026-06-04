const formatNumber = (value, options = {}) =>
  new Intl.NumberFormat("en-US", options).format(value);

const formatQuoteMeta = (quote, overview) =>
  [quote.exchange, quote.currency, overview.source].filter(Boolean).join(" · ");

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

export const MarketOverview = ({
  overview,
  loading,
  error,
  isSavedInWatchlist,
  onToggleWatchlist,
  onReload,
}) => {
  if (loading) {
    return <div className="paper-panel p-4">Loading market overview...</div>;
  }

  if (error) {
    return <div className="paper-panel p-4 paper-warning">{error}</div>;
  }

  if (!overview) {
    return null;
  }

  const { quote } = overview;
  const positive = quote.change >= 0;
  const cacheStamp = formatCacheStamp(quote.cache?.fetchedAt);
  const cacheLabel = quote.cache?.hit ? "Cached" : "Fetched";

  return (
    <div className="paper-panel p-4 h-100">
      <div className="d-flex flex-wrap justify-content-between gap-3 align-items-start">
        <div>
          <div className="dashboard-live-label mb-2">
            <input
              type="checkbox"
              className="paper-checkbox"
              checked={isSavedInWatchlist}
              onChange={(event) => onToggleWatchlist(event.target.checked)}
              aria-label="Toggle watchlist status"
            />
            <span className="eyebrow mb-0">Live symbol</span>
          </div>
          <h2 className="section-title mb-1">
            {quote.symbol} <span className="subhead">{quote.name}</span>
          </h2>
          <p className="body-muted mb-0">
            {formatQuoteMeta(quote, overview)}
          </p>
        </div>
        <div className="text-lg-end">
          <div className="mb-2">
            <span className="provider-chip">{overview.source}</span>
          </div>
          <div className="price-line">
            ${formatNumber(quote.price, { maximumFractionDigits: 2 })}
          </div>
          <div className={positive ? "price-change is-up" : "price-change is-down"}>
            {positive ? "+" : ""}
            {formatNumber(quote.change, { maximumFractionDigits: 2 })} (
            {formatNumber(quote.percentChange, { maximumFractionDigits: 2 })}%)
          </div>
        </div>
      </div>

      <div className="row row-cols-2 row-cols-lg-4 g-3 mt-2">
        <MetricCard label="Open" value={quote.open} />
        <MetricCard label="Day high" value={quote.high} />
        <MetricCard label="Day low" value={quote.low} />
        <MetricCard label="Volume" value={quote.volume} digits={0} />
      </div>

      <div className="cache-row mt-3">
        <span className="small body-muted">
          {cacheLabel}: {cacheStamp || "n/a"}
        </span>
        <button type="button" className="cache-reload" onClick={onReload}>
          Reload
        </button>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, digits = 2 }) => (
  <div className="col">
    <div className="metric-card">
      <div className="small body-muted">{label}</div>
      <div className="fw-semibold">
        {new Intl.NumberFormat("en-US", {
          maximumFractionDigits: digits,
        }).format(value)}
      </div>
    </div>
  </div>
);
