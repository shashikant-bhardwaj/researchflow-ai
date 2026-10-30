import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const PROGRESS_MESSAGES = [
  "Searching for relevant information...",
  "Reading selected sources...",
  "Preparing the research report...",
  "Reviewing the generated report...",
];

export default function LoadingState({ onCancel }) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % PROGRESS_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent/30 bg-card">
          <Loader2 className="h-9 w-9 text-accent animate-spin" />
        </div>
      </div>

      <h3 className="text-lg font-semibold text-text-primary mb-2">Research in progress</h3>
      <p className="text-sm text-text-secondary max-w-md text-center mb-2 leading-relaxed">
        The multi-agent pipeline is running on the backend. This may take a minute or more.
      </p>

      <div className="h-6 my-3">
        <p key={messageIndex} className="animate-fade-in text-sm text-accent font-medium">
          {PROGRESS_MESSAGES[messageIndex]}
        </p>
      </div>

      <p className="text-xs text-text-muted max-w-sm text-center mb-6 leading-relaxed">
        These messages are illustrative progress indicators, not confirmed live agent events from the server.
      </p>

      {onCancel && (
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text-secondary hover:text-error hover:border-error/40 transition-all"
        >
          Cancel Request
        </button>
      )}
    </div>
  );
}


