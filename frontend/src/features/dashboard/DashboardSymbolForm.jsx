export const DashboardSymbolForm = ({ draftSymbol, onDraftSymbolChange, onSubmit }) => (
  <div className="paper-panel p-3 p-lg-4">
    <form className="row g-3 align-items-end" onSubmit={onSubmit}>
      <div className="col-md-4">
        <label className="form-label form-label-paper">Symbol</label>
        <input
          className="form-control paper-input"
          value={draftSymbol}
          onChange={(event) => onDraftSymbolChange(event.target.value)}
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
);
