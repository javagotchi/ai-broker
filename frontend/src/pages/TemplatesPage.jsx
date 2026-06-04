import { useState } from "react";
import { TemplateEntry } from "../features/templates/TemplateEntry.jsx";
import { templates } from "../features/templates/templates.js";

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
          <TemplateEntry
            key={template.id}
            copied={copiedId === template.id}
            onCopy={onCopy}
            template={template}
          />
        ))}
      </div>
    </div>
  );
};
