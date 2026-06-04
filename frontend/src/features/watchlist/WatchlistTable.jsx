import { WatchlistRows } from "./WatchlistRows.jsx";

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
