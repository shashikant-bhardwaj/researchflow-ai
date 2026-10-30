import { Search, Sparkles } from "lucide-react";

export default function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full" />
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-lg">
          <Sparkles className="h-7 w-7 text-accent" />
        </div>
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-md leading-relaxed mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}

export function NoContentState({ icon: Icon = Search, message = "No content available yet." }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 animate-fade-in">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card mb-3">
        <Icon className="h-5 w-5 text-text-muted" />
      </div>
      <p className="text-sm text-text-secondary">{message}</p>
    </div>
  );
}
