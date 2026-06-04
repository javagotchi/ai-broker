import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPause, faPenNib, faPlay, faSquare } from "@fortawesome/free-solid-svg-icons";
import {
  formatIdeaTimestamp,
  formatOutcomeValue,
  toIdeaHex,
} from "./watchlist-formatters.js";

const IDEA_STATUSES = [
  {
    value: "draft",
    label: "Set to draft",
    title: "Set to draft",
    icon: faSquare,
    iconClassName: "fa-icon fa-icon-stop",
  },
  {
    value: "paused",
    label: "Pause",
    title: "Pause",
    icon: faPause,
    iconClassName: "fa-icon fa-icon-pause",
  },
  {
    value: "active",
    label: "Start",
    title: "Start",
    icon: faPlay,
    iconClassName: "fa-icon fa-icon-play",
  },
];

const IdeaStatusActions = ({ idea, onSetIdeaStatus }) => (
  <div className="idea-status-actions">
    {IDEA_STATUSES.map((statusOption) => (
      <button
        key={statusOption.value}
        type="button"
        className={`btn btn-sm paper-icon-button ${idea.status === statusOption.value ? "is-active" : ""}`}
        onClick={() => onSetIdeaStatus(idea, statusOption.value)}
        aria-label={`${statusOption.label} ${idea.title}`}
        title={statusOption.title}
      >
        <FontAwesomeIcon icon={statusOption.icon} className={statusOption.iconClassName} />
      </button>
    ))}
  </div>
);

const IdeaEntry = ({ idea, onEditIdea, onSetIdeaStatus }) => {
  const ideaHex = toIdeaHex(idea.id);

  return (
    <article key={idea.id} id={`IDEA_${ideaHex}`} className="idea-entry">
      <div className="d-flex justify-content-between gap-3 align-items-start">
        <div>
          <div className="idea-entry-ticker" title={formatIdeaTimestamp(idea.createdAt)}>
            {ideaHex} {idea.ticker}
            {idea.companyName ? (
              <span className="idea-entry-company-inline"> {idea.companyName}</span>
            ) : null}
          </div>
        </div>
        <div className="d-flex align-items-start gap-2">
          <IdeaStatusActions idea={idea} onSetIdeaStatus={onSetIdeaStatus} />
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
          <div className="idea-entry-outcome-value">{formatOutcomeValue(idea.outcomeValue)}</div>
        </div>
      </div>
    </article>
  );
};

export const IdeaListPanel = ({ ideas, onEditIdea, onSetIdeaStatus }) => (
  <div className="paper-panel p-4 h-100">
    <p className="eyebrow mb-1">Idea list</p>
    <div className="section-rule mb-3" />
    {ideas.length > 0 ? (
      <div className="idea-list">
        {ideas.map((idea) => (
          <IdeaEntry
            key={idea.id}
            idea={idea}
            onEditIdea={onEditIdea}
            onSetIdeaStatus={onSetIdeaStatus}
          />
        ))}
      </div>
    ) : (
      <p className="small body-muted mb-0">No ideas saved yet.</p>
    )}
  </div>
);
