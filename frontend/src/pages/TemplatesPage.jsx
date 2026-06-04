import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";

const templates = [
  {
    id: "entry-window",
    title: "Entry window",
    prompt:
      "Evaluate whether this instrument offers a disciplined entry window for a medium-term position. Use trend, drawdown, volatility, recent catalysts, and valuation context. End with a clear verdict: buy now, wait, or avoid.",
  },
  {
    id: "buy-and-hold",
    title: "Buy and hold",
    prompt:
      "Assume an initial investment of 10000 USD on the chosen start date. Explain whether this is a credible long-term buy-and-hold candidate, what the core thesis is, which risks could break the thesis, and which signals should trigger a review.",
  },
  {
    id: "momentum-check",
    title: "Momentum check",
    prompt:
      "Check whether this instrument currently fits a momentum strategy. Look at price strength, trend persistence, volume confirmation, and market regime. Summarize what would confirm continuation and what would invalidate the setup.",
  },
  {
    id: "mean-reversion",
    title: "Mean reversion",
    prompt:
      "Test whether this instrument is a valid mean-reversion candidate. Assess distance from recent averages, oversold conditions, volatility, and catalyst risk. State whether the pullback is attractive or whether weakness should be avoided.",
  },
  {
    id: "risk-review",
    title: "Risk review",
    prompt:
      "Perform a risk-first review of this instrument. Identify thesis risks, balance-sheet or cash-flow issues, sector risk, macro sensitivity, and trigger points that would justify reducing or exiting a position.",
  },
  {
    id: "reallocation",
    title: "Reallocation",
    prompt:
      "Assume this instrument competes for capital with other ideas in the watchlist. Evaluate whether new capital should be allocated here now, delayed, or redirected elsewhere. Rank conviction, timing, and downside risk.",
  },
];

export const TemplatesPage = () => {
  const [copiedId, setCopiedId] = useState("");

  const onCopy = async (template) => {
    try {
      await navigator.clipboard.writeText(template.prompt);
      setCopiedId(template.id);
      window.setTimeout(() => {
        setCopiedId((current) => (current === template.id ? "" : current));
      }, 1200);
    } catch {
      setCopiedId("");
    }
  };

  return (
    <div className="paper-panel p-4">
      <p className="eyebrow mb-1">Templates</p>
      <div className="section-rule mb-3" />
      <div className="template-list">
        {templates.map((template) => (
          <article key={template.id} className="template-entry">
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
                title={copiedId === template.id ? "Copied" : "Copy prompt"}
              >
                <FontAwesomeIcon
                  icon={copiedId === template.id ? faCheck : faCopy}
                  className="fa-icon"
                />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
