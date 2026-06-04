import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCopy } from "@fortawesome/free-solid-svg-icons";

export const TemplateEntry = ({ copied, onCopy, template }) => (
  <article className="template-entry">
    <div className="d-flex justify-content-between align-items-start gap-3">
      <div>
        <h2 className="template-title mb-2">{template.title}</h2>
        <p className="mb-0">{template.prompt}</p>
      </div>
      <button
        type="button"
        className="btn btn-sm paper-icon-button"
        onClick={() => onCopy(template)}
        aria-label={`Copy ${template.title}`}
        title={copied ? "Copied" : "Copy prompt"}
      >
        <FontAwesomeIcon icon={copied ? faCheck : faCopy} className="fa-icon" />
      </button>
    </div>
  </article>
);
