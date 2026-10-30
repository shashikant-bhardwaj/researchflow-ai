import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorState({ message, onRetry, title = "Something went wrong" }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 animate-fade-in">
      <div className="relative mb-5">
        <div className="absolute inset-0 bg-error/20 blur-2xl rounded-full" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-error/30 bg-error/10">
          <AlertTriangle className="h-6 w-6 text-error" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-sm text-text-secondary max-w-md leading-relaxed mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-text-primary hover:bg-elevated hover:border-accent/40 transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  );
}
