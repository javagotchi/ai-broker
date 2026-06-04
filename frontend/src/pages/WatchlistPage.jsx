import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faPause,
  faPenNib,
  faPlay,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";
import { WatchlistTable } from "../features/watchlist/WatchlistTable.jsx";
import { createIdea, fetchIdeas, updateIdea } from "../services/idea-api.js";
import {
  deleteArchivedWatchlistItem,
  fetchWatchlist,
  moveWatchlistItemToTop,
  setWatchlistItemActive,
} from "../services/watchlist-api.js";
import { fetchWatchlistQuotes } from "../services/market-api.js";

export const WatchlistPage = () => {
  const emptyIdeaForm = {
    id: null,
    watchlistItemId: "",
    title: "",
    objective: "",
    startDate: "",
    endDate: "",
  };
  const [items, setItems] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState(emptyIdeaForm);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const activeItems = items.filter((item) => !item.archivedAt);
  const archivedItems = items.filter((item) => item.archivedAt);
  const toIdeaHex = (id) => Number(id).toString(16).toUpperCase().padStart(2, "0");
  const formatOutcomeValue = (value) => {
    if (typeof value !== "number" || Number.isNaN(value)) {
      return "0$";
    }

    return `${value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}$`;
  };
  const formatIdeaTimestamp = (value) => {
    if (!value) {
      return "";
    }

    const date = new Date(value.replace(" ", "T"));
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString("de-DE");
  };
  const buildSuggestedIdeaTitle = (ticker, excludedIdeaId = null) => {
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

  const load = async () => {
    const [watchlistResult, quotesResult, ideasResult] = await Promise.all([
      fetchWatchlist(),
      fetchWatchlistQuotes(),
      fetchIdeas(),
    ]);

    setItems(watchlistResult.items);
    setQuotes(quotesResult.items);
    setIdeas(ideasResult.items);
  };

  useEffect(() => {
    load().catch((loadError) => setError(loadError.message));
  }, []);

  useEffect(() => {
    if (activeItems.length === 0 && form.watchlistItemId) {
      setForm(emptyIdeaForm);
    }
  }, [activeItems, form.watchlistItemId]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    const nextFieldErrors = {};

    if (!form.watchlistItemId) {
      nextFieldErrors.watchlistItemId = "Select a ticker first.";
    }

    if (!form.title.trim()) {
      nextFieldErrors.title = "Title is required.";
    }

    if (!form.objective.trim()) {
      nextFieldErrors.objective = "Prompt is required.";
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});

    try {
      const payload = {
        watchlistItemId: Number(form.watchlistItemId),
        title: form.title,
        objective: form.objective,
        status: form.id
          ? ideas.find((idea) => idea.id === form.id)?.status || "active"
          : "active",
        startDate: form.startDate,
        endDate: form.endDate,
      };

      if (form.id) {
        await updateIdea(form.id, payload);
      } else {
        await createIdea(payload);
      }

      setForm(emptyIdeaForm);
      await load();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const onEditIdea = (idea) => {
    setError("");
    setFieldErrors({});
    setForm({
      id: idea.id,
      watchlistItemId: String(idea.watchlistItemId),
      title: idea.title || "",
      objective: idea.objective || "",
      startDate: idea.startDate || "",
      endDate: idea.endDate || "",
    });
  };

  const onCancelEdit = () => {
    setError("");
    setFieldErrors({});
    setForm(emptyIdeaForm);
  };

  const onSetActive = async (id, active) => {
    setError("");

    try {
      await setWatchlistItemActive(id, active);
      await load();
    } catch (toggleError) {
      setError(toggleError.message);
    }
  };

  const onMoveToTop = async (id) => {
    setError("");

    try {
      await moveWatchlistItemToTop(id);
      await load();
    } catch (moveError) {
      setError(moveError.message);
    }
  };

  const onDeleteArchived = async (id) => {
    setError("");

    try {
      await deleteArchivedWatchlistItem(id);
      await load();
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  const onSetIdeaStatus = async (idea, status) => {
    setError("");

    try {
      await updateIdea(idea.id, {
        watchlistItemId: idea.watchlistItemId,
        title: idea.title,
        objective: idea.objective,
        status,
        startDate: idea.startDate || "",
        endDate: idea.endDate || "",
      });
      await load();
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12">
        <WatchlistTable
          items={activeItems}
          archivedItems={archivedItems}
          quotes={quotes}
          ideas={ideas}
          onSetActive={onSetActive}
          onMoveToTop={onMoveToTop}
          onDeleteArchived={onDeleteArchived}
        />
      </div>
      <div className="col-lg-6">
        <div className="paper-panel p-4">
          <p className="eyebrow mb-1">Add idea</p>
          <form className="d-grid gap-3" onSubmit={onSubmit}>
            <label className="d-grid gap-2">
              <span className="form-label-paper">Ticker</span>
              <select
                className="form-control paper-input"
                value={form.watchlistItemId}
                onChange={(event) => {
                  const selectedItem = activeItems.find(
                    (item) => String(item.id) === event.target.value,
                  );
                  setFieldErrors((current) => ({ ...current, watchlistItemId: "" }));
                  setForm({
                    ...form,
                    watchlistItemId: event.target.value,
                    title: selectedItem
                      ? buildSuggestedIdeaTitle(selectedItem.ticker, form.id)
                      : "",
                  });
                }}
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
                  setFieldErrors((current) => ({ ...current, title: "" }));
                  setForm({ ...form, title: event.target.value });
                }}
              />
              {fieldErrors.title ? (
                <span className="form-error-text">{fieldErrors.title}</span>
              ) : null}
            </label>
            <div className="idea-form-meta-grid">
              <div>
                <label className="d-grid gap-2">
                  <span className="form-label-paper">Start</span>
                  <input
                    type="date"
                    className="form-control paper-input"
                    value={form.startDate}
                    onChange={(event) => setForm({ ...form, startDate: event.target.value })}
                  />
                </label>
              </div>
              <div>
                <label className="d-grid gap-2">
                  <span className="form-label-paper">End</span>
                  <input
                    type="date"
                    className="form-control paper-input"
                    value={form.endDate}
                    onChange={(event) => setForm({ ...form, endDate: event.target.value })}
                  />
                </label>
              </div>
            </div>
            <textarea
              className="form-control paper-input"
              placeholder="Prompt for the AI"
              rows="8"
              maxLength="1000"
              value={form.objective}
              onChange={(event) => {
                setFieldErrors((current) => ({ ...current, objective: "" }));
                setForm({ ...form, objective: event.target.value });
              }}
            />
            {fieldErrors.objective ? (
              <span className="form-error-text">{fieldErrors.objective}</span>
            ) : null}
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
      </div>
      <div className="col-lg-6">
        <div className="paper-panel p-4 h-100">
          <p className="eyebrow mb-1">Idea list</p>
          <div className="section-rule mb-3" />
          {ideas.length > 0 ? (
            <div className="idea-list">
              {ideas.map((idea) => (
                <article
                  key={idea.id}
                  id={`IDEA_${toIdeaHex(idea.id)}`}
                  className="idea-entry"
                >
                  <div className="d-flex justify-content-between gap-3 align-items-start">
                    <div>
                      <div className="idea-entry-ticker" title={formatIdeaTimestamp(idea.createdAt)}>
                        {toIdeaHex(idea.id)} {idea.ticker}
                        {idea.companyName ? (
                          <span className="idea-entry-company-inline">
                            {" "}
                            {idea.companyName}
                          </span>
                        ) : null}
                      </div>
                    </div>
                    <div className="d-flex align-items-start gap-2">
                      <div className="idea-status-actions">
                        <button
                          type="button"
                          className={`btn btn-sm paper-icon-button ${idea.status === "draft" ? "is-active" : ""}`}
                          onClick={() => onSetIdeaStatus(idea, "draft")}
                          aria-label={`Set ${idea.title} to draft`}
                          title="Set to draft"
                        >
                          <FontAwesomeIcon icon={faSquare} className="fa-icon fa-icon-stop" />
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm paper-icon-button ${idea.status === "paused" ? "is-active" : ""}`}
                          onClick={() => onSetIdeaStatus(idea, "paused")}
                          aria-label={`Pause ${idea.title}`}
                          title="Pause"
                        >
                          <FontAwesomeIcon icon={faPause} className="fa-icon fa-icon-pause" />
                        </button>
                        <button
                          type="button"
                          className={`btn btn-sm paper-icon-button ${idea.status === "active" ? "is-active" : ""}`}
                          onClick={() => onSetIdeaStatus(idea, "active")}
                          aria-label={`Start ${idea.title}`}
                          title="Start"
                        >
                          <FontAwesomeIcon icon={faPlay} className="fa-icon fa-icon-play" />
                        </button>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm paper-icon-button"
                        onClick={() => onEditIdea(idea)}
                        aria-label={`Edit ${idea.title}`}
                        title="Edit idea"
                      >
                        <FontAwesomeIcon icon={faPenNib} className="fa-icon" />
                      </button>
                    </div>
                  </div>
                  <h3 className="idea-entry-title mt-2 mb-1">{idea.title}</h3>
                  <div className="idea-entry-meta form-error-text body-muted">
                    {idea.status}
                    {idea.startDate || idea.endDate
                      ? ` · ${idea.startDate || "open"} to ${idea.endDate || "open"}`
                      : ""}
                  </div>
                  <div className="idea-entry-body mt-2">
                    <p className="mb-0">{idea.objective}</p>
                    <div className="idea-entry-outcome-wrap">
                      <div className="idea-entry-outcome-value">
                        {formatOutcomeValue(idea.outcomeValue)}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="small body-muted mb-0">No ideas saved yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};
