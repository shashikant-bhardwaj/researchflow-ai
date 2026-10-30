import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Copy, Download, ArrowLeft } from "lucide-react";
import AgentPipeline from "../components/AgentPipeline";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import ResultTabs from "../components/ResultTabs";
import { useToast } from "../components/Toast";

export default function ResearchWorkspace({ research, onNewResearch }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { show } = useToast();
  const { status, result, error, topic, run, cancel, loadFromHistory } = research;

  // History navigation only loads an existing result; it never calls the research API.
  useEffect(() => {
    const entry = location.state?.historyEntry;
    if (!entry) return;

    loadFromHistory(entry);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.key, location.pathname, location.state, loadFromHistory, navigate]);

  const isLoading = status === "loading";
  const isSuccess = status === "success" && result;
  const isError = status === "error";
  const isCancelled = status === "cancelled";
  const isIdle = status === "idle";

  const handleCopyReport = async () => {
    if (!result?.report) {
      show("No report available to copy", "info");
      return;
    }
    try {
      await navigator.clipboard.writeText(result.report);
      show("Report copied to clipboard", "success");
    } catch {
      show("Unable to copy report", "error");
    }
  };

  const handleDownload = () => {
    if (!result?.report) {
      show("No report available to download", "info");
      return;
    }

    // Escape report text before placing it into the printable document.
    const escapeHtml = (value) =>
      String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
      })[char]);

    const reportHtml = escapeHtml(result.report)
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/^[-*] (.*)$/gm, '<li>$1</li>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n{2,}/g, '</p><p>')
      .replace(/\n/g, '<br>');

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      show("Please allow pop-ups to export the PDF", "error");
      return;
    }

    printWindow.document.write(`<!doctype html>
      <html><head><meta charset="utf-8"><title>${escapeHtml(result.topic || "Research Report")}</title>
      <style>
        @page { size: A4; margin: 20mm; }
        body { font-family: Arial, Helvetica, sans-serif; color: #222; line-height: 1.65; font-size: 11pt; }
        h1 { font-size: 24pt; margin: 0 0 10px; } h2 { font-size: 17pt; margin-top: 24px; }
        h3 { font-size: 13pt; margin-top: 18px; } p { margin: 0 0 12px; }
        li { margin: 4px 0 4px 20px; } .meta { color: #666; font-size: 10pt; margin-bottom: 24px; }
        hr { border: 0; border-top: 1px solid #ddd; margin: 20px 0; }
      </style></head><body>
      <h1>Research Report</h1><div class="meta"><strong>Topic:</strong> ${escapeHtml(result.topic || topic || "Research")}</div>
      <hr><p>${reportHtml}</p><script>window.onload = () => { window.focus(); window.print(); };</script>
      </body></html>`);
    printWindow.document.close();
    show("PDF export opened — choose 'Save as PDF' in the print dialog", "success");
  };

  const handleNewResearch = () => {
    onNewResearch?.();
  };

  const handleRetry = () => {
    if (topic) {
      run(topic);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Research header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 animate-fade-in">
        <div className="min-w-0 flex-1">
          <button
            onClick={handleNewResearch}
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors mb-3"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            New Research
          </button>
          {topic ? (
            <>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">Research Topic</p>
              <h1 className="text-lg sm:text-xl font-semibold text-text-primary leading-snug break-words">{topic}</h1>
            </>
          ) : (
            <h1 className="text-lg sm:text-xl font-semibold text-text-primary">Research Workspace</h1>
          )}
        </div>
        {isSuccess && result?.report && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleCopyReport}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              Download PDF
            </button>
            <button
              onClick={handleNewResearch}
              className="inline-flex items-center gap-1.5 rounded-lg gradient-accent px-3 py-2 text-xs font-medium text-white hover:opacity-90 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              New
            </button>
          </div>
        )}
      </div>

      {/* Pipeline visualization */}
      {status !== "idle" && (
        <AgentPipeline pipelineStatus={status === "success" ? "completed" : status === "loading" ? "loading" : "idle"} />
      )}

      {/* Content area */}
      {isIdle && (
        <EmptyState
          title="No active research"
          description="Enter a research topic on the Overview page to start the multi-agent pipeline."
          action={
            <button
              onClick={handleNewResearch}
              className="inline-flex items-center gap-2 rounded-lg gradient-accent px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 hover:opacity-90 transition-all"
            >
              <Plus className="h-4 w-4" />
              Start New Research
            </button>
          }
        />
      )}

      {isLoading && <LoadingState onCancel={cancel} />}

      {isCancelled && (
        <ErrorState
          title="Research cancelled"
          message="The request was cancelled. The backend may still be processing, but the browser stopped waiting."
          onRetry={handleRetry}
        />
      )}

      {isError && <ErrorState message={error || "An unknown error occurred."} onRetry={handleRetry} />}

      {isSuccess && (
        <div className="animate-fade-in">
          <ResultTabs result={result} />
        </div>
      )}
    </div>
  );
}
