import { useEffect, useState } from "react";
import { WatchlistTable } from "../features/watchlist/WatchlistTable.jsx";
import { IdeaFormPanel } from "../features/watchlist/IdeaFormPanel.jsx";
import { IdeaListPanel } from "../features/watchlist/IdeaListPanel.jsx";
import {
  buildSuggestedIdeaTitle,
  EMPTY_IDEA_FORM,
} from "../features/watchlist/watchlist-formatters.js";
import { createIdea, fetchIdeas, updateIdea } from "../services/idea-api.js";
import {
  deleteArchivedWatchlistItem,
  fetchWatchlist,
  moveWatchlistItemToTop,
  setWatchlistItemActive,
} from "../services/watchlist-api.js";
import { fetchWatchlistQuotes } from "../services/market-api.js";

export const WatchlistPage = () => {
  const [items, setItems] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState(EMPTY_IDEA_FORM);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const activeItems = items.filter((item) => !item.archivedAt);
  const archivedItems = items.filter((item) => item.archivedAt);

  const load = async () => {
    const [watchlistResult, quotesResult, ideasResult] = await Promise.all([
      fetchWatchlist(),
      fetchWatchlistQuotes(),
      fetchIdeas(),
    ]);

    setItems(watchlistResult.items);
    setQuotes(quotesResult.items);
    setIdeas(ideasResult.items);
    setForm((current) => {
      if (!current.watchlistItemId) {
        return current;
      }

      const hasSelectedActiveItem = watchlistResult.items.some(
        (item) => !item.archivedAt && String(item.id) === current.watchlistItemId,
      );

      return hasSelectedActiveItem ? current : EMPTY_IDEA_FORM;
    });
  };

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        await load();
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message);
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateFormField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const clearFieldError = (field) => {
    setFieldErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleWatchlistItemSelect = (watchlistItemId) => {
    const selectedItem = activeItems.find((item) => String(item.id) === watchlistItemId);

    clearFieldError("watchlistItemId");
    setForm((current) => ({
      ...current,
      watchlistItemId,
      title: selectedItem
        ? buildSuggestedIdeaTitle(ideas, selectedItem.ticker, current.id)
        : "",
    }));
  };

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

      setForm(EMPTY_IDEA_FORM);
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
    setForm(EMPTY_IDEA_FORM);
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
        <IdeaFormPanel
          activeItems={activeItems}
          error={error}
          fieldErrors={fieldErrors}
          form={form}
          onCancelEdit={onCancelEdit}
          onFieldErrorClear={clearFieldError}
          onFormChange={updateFormField}
          onSelectWatchlistItem={handleWatchlistItemSelect}
          onSubmit={onSubmit}
        />
      </div>
      <div className="col-lg-6">
        <IdeaListPanel ideas={ideas} onEditIdea={onEditIdea} onSetIdeaStatus={onSetIdeaStatus} />
      </div>
    </div>
  );
};
