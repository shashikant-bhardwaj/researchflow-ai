import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { History, Trash2, X, FileText, ArrowRight, AlertTriangle } from "lucide-react";
import EmptyState from "../components/EmptyState";
import { useToast } from "../components/Toast";
import {
  loadHistory,
  deleteResearch,
  clearHistory,
  formatTimestamp,
} from "../utils/researchStorage";

export default function ResearchHistory() {
  const navigate = useNavigate();
  const { show } = useToast();
  const [history, setHistory] = useState([]);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const handleOpen = (entry) => {
    navigate("/workspace", { state: { historyEntry: entry } });
  };

  const handleDelete = (id) => {
    const updated = deleteResearch(id);
    setHistory(updated);
    show("Research entry deleted", "info");
  };

  const handleClear = () => {
    clearHistory();
    setHistory([]);
    setConfirmClear(false);
    show("History cleared", "info");
  };

  if (history.length === 0) {
    return (
      <div className="py-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-1">Research History</h2>
          <p className="text-sm text-text-secondary">Your recent research results, saved locally in this browser.</p>
        </div>
        <EmptyState
          icon={History}
          title="No saved research yet"
          description="Successful research results are saved here automatically. They are stored locally in your browser and not synchronized across devices."
          action={
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2 rounded-lg gradient-accent px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 hover:opacity-90 transition-all"
            >
              Start Researching
            </button>
          }
        />
      </div>
    );
  }

  return (
    <div className="py-2 space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-1">Research History</h2>
          <p className="text-sm text-text-secondary">
            {history.length} saved {history.length === 1 ? "entry" : "entries"} · stored locally in this browser only.
          </p>
        </div>
        <button
          onClick={() => setConfirmClear(true)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-text-secondary hover:text-error hover:border-error/40 transition-all flex-shrink-0"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Clear All
        </button>
      </div>

      <div className="space-y-3">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="group rounded-xl border border-border bg-card p-4 hover:border-accent/30 transition-all cursor-pointer"
            onClick={() => handleOpen(entry)}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-elevated border border-border flex-shrink-0 mt-0.5">
                <FileText className="h-4 w-4 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary line-clamp-2 leading-snug">{entry.topic}</p>
                {entry.report && (
                  <p className="text-xs text-text-muted line-clamp-1 mt-1">{entry.report.slice(0, 150)}...</p>
                )}
                <p className="text-xs text-text-secondary mt-2">{formatTimestamp(entry.timestamp)}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(entry.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-all"
                  aria-label="Delete this research entry"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <ArrowRight className="h-4 w-4 text-text-muted group-hover:text-accent transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clear confirmation dialog */}
      {confirmClear && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setConfirmClear(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-error/10 border border-error/20 flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-error" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-text-primary mb-1">Clear all research history?</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  This will permanently remove all {history.length} saved research entries from this browser. This cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setConfirmClear(false)}
                className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 rounded-lg bg-error px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-all"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
