import { useEffect, useState } from "react";
import { MarketOverview } from "../features/dashboard/MarketOverview.jsx";
import { PriceChartCard } from "../features/dashboard/PriceChartCard.jsx";
import { fetchMarketOverview } from "../services/market-api.js";
import {
  createWatchlistItem,
  fetchWatchlist,
  setWatchlistItemActive,
} from "../services/watchlist-api.js";

const inferAssetType = (name = "") => (name.toUpperCase().includes("ETF") ? "ETF" : "Stock");

export const DashboardPage = () => {
  const [overview, setOverview] = useState(null);
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [draftSymbol, setDraftSymbol] = useState("");
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentWatchlistItem = overview
    ? watchlistItems.find((item) => item.ticker === overview.symbol)
    : null;
  const isSavedInWatchlist = Boolean(currentWatchlistItem && !currentWatchlistItem.archivedAt);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await fetchWatchlist();
        const topItem = result.items.find((item) => !item.archivedAt);

        if (!active) {
          return;
        }

        setWatchlistItems(result.items);

        if (topItem) {
          setDraftSymbol(topItem.ticker);
          setRequest({
            symbol: topItem.ticker,
            forceRefresh: false,
            requestId: Date.now(),
          });
        } else {
          setDraftSymbol("");
          setRequest(null);
          setOverview(null);
          setLoading(false);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
          setLoading(false);
        }
      }
    };

    initialize();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!request?.symbol) {
      return;
    }

    let active = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await fetchMarketOverview(request.symbol, {
          forceRefresh: request.forceRefresh,
        });
        if (active) {
          setOverview(result);
        }
      } catch (requestError) {
        if (active) {
          setError(requestError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [request]);

  const refreshWatchlistItems = async () => {
    const result = await fetchWatchlist();
    setWatchlistItems(result.items);
    return result.items;
  };

  const onToggleWatchlist = async (checked) => {
    if (!overview) {
      return;
    }

    setError("");

    try {
      if (checked) {
        if (currentWatchlistItem) {
          await setWatchlistItemActive(currentWatchlistItem.id, true);
        } else {
          await createWatchlistItem({
            assetType: inferAssetType(overview.quote.name),
            ticker: overview.symbol,
            quoteSymbol: overview.quote.symbol ?? overview.symbol,
            exchange: overview.quote.exchange ?? "",
            companyName: overview.quote.name ?? "",
            thesis: "",
          });
        }
      } else if (currentWatchlistItem) {
        await setWatchlistItemActive(currentWatchlistItem.id, false);
      }

      await refreshWatchlistItems();
    } catch (toggleError) {
      setError(toggleError.message);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="paper-panel p-3 p-lg-4">
          <form
            className="row g-3 align-items-end"
            onSubmit={(event) => {
              event.preventDefault();

              if (!draftSymbol.trim()) {
                setOverview(null);
                setRequest(null);
                return;
              }

              setRequest({
                symbol: draftSymbol.toUpperCase(),
                forceRefresh: false,
                requestId: Date.now(),
              });
            }}
          >
            <div className="col-md-4">
              <label className="form-label form-label-paper">Symbol</label>
              <input
                className="form-control paper-input"
                value={draftSymbol}
                onChange={(event) => setDraftSymbol(event.target.value)}
                placeholder="Ticker"
              />
            </div>
            <div className="col-md-auto">
              <button type="submit" className="btn paper-button fw-semibold">
                Load live data
              </button>
            </div>
          </form>
        </div>
      </div>

      {request?.symbol ? (
        <>
          <div className="col-lg-5">
            <MarketOverview
              overview={overview}
              loading={loading}
              error={error}
              isSavedInWatchlist={isSavedInWatchlist}
              onToggleWatchlist={onToggleWatchlist}
              onReload={() =>
                setRequest((current) => ({
                  symbol: current.symbol,
                  forceRefresh: true,
                  requestId: Date.now(),
                }))
              }
            />
          </div>
          <div className="col-lg-7">
            <PriceChartCard overview={overview} />
          </div>
        </>
      ) : null}
    </div>
  );
};
