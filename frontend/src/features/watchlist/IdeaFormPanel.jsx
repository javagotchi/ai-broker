import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk, faSquare } from "@fortawesome/free-solid-svg-icons";

export const IdeaFormPanel = ({
  activeItems,
  error,
  fieldErrors,
  form,
  onCancelEdit,
  onFieldErrorClear,
  onFormChange,
  onSelectWatchlistItem,
  onSubmit,
}) => (
  <div className="paper-panel p-4">
    <p className="eyebrow mb-1">Add idea</p>
    <form className="d-grid gap-3" onSubmit={onSubmit}>
      <label className="d-grid gap-2">
        <span className="form-label-paper">Ticker</span>
        <select
          className="form-control paper-input"
          value={form.watchlistItemId}
          onChange={(event) => onSelectWatchlistItem(event.target.value)}
          disabled={activeItems.length === 0}
        >
          <option value="">Select ticker</option>
          {activeItems.length === 0 ? (
            <option value="" disabled>
              No active watchlist items
            </option>
          ) : null}
          {activeItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.ticker}
            </option>
          ))}
        </select>
        {fieldErrors.watchlistItemId ? (
          <span className="form-error-text">{fieldErrors.watchlistItemId}</span>
        ) : null}
      </label>

      <label className="d-grid gap-2">
        <span className="form-label-paper">Title</span>
        <input
          className="form-control paper-input"
          placeholder="Idea title"
          maxLength="120"
          value={form.title}
          onChange={(event) => {
            onFieldErrorClear("title");
            onFormChange("title", event.target.value);
          }}
        />
        {fieldErrors.title ? <span className="form-error-text">{fieldErrors.title}</span> : null}
      </label>

      <div className="idea-form-meta-grid">
        <label className="d-grid gap-2">
          <span className="form-label-paper">Start</span>
          <input
            type="date"
            className="form-control paper-input"
            value={form.startDate}
            onChange={(event) => onFormChange("startDate", event.target.value)}
          />
        </label>
        <label className="d-grid gap-2">
          <span className="form-label-paper">End</span>
          <input
            type="date"
            className="form-control paper-input"
            value={form.endDate}
            onChange={(event) => onFormChange("endDate", event.target.value)}
          />
        </label>
      </div>

      <div>
        <textarea
          className="form-control paper-input"
          placeholder="Prompt for the AI"
          rows="8"
          maxLength="1000"
          value={form.objective}
          onChange={(event) => {
            onFieldErrorClear("objective");
            onFormChange("objective", event.target.value);
          }}
        />
        {fieldErrors.objective ? (
          <span className="form-error-text">{fieldErrors.objective}</span>
        ) : null}
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <span className="small body-muted">{form.objective.length}/1000</span>
        <div className="d-flex gap-2">
          {form.id ? (
            <button
              type="button"
              className="btn paper-icon-button"
              onClick={onCancelEdit}
              aria-label="Cancel edit"
              title="Cancel edit"
            >
              <FontAwesomeIcon icon={faSquare} className="fa-icon fa-icon-stop" />
            </button>
          ) : null}
          <button
            type="submit"
            className="btn paper-icon-button paper-icon-button-filled"
            aria-label={form.id ? "Save idea changes" : "Save idea"}
            title={form.id ? "Save idea changes" : "Save idea"}
          >
            <FontAwesomeIcon icon={faFloppyDisk} className="fa-icon" />
          </button>
        </div>
      </div>
    </form>

    {error ? <p className="form-error-text mt-3 mb-0">{error}</p> : null}
  </div>
);
