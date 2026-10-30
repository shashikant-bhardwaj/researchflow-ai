import { useRef, useState } from "react";
import { Sparkles, CornerDownLeft } from "lucide-react";

const EXAMPLE_TOPICS = [
  "How will AI agents transform software development?",
  "The current state of renewable energy storage.",
  "Applications of large language models in healthcare.",
  "The future of cybersecurity in an AI-driven world.",
];

const MAX_CHARS = 1000;

export default function ResearchInput({ onSubmit, disabled }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef(null);

  const trimmed = value.trim();
  const isValid = trimmed.length > 0 && trimmed.length <= MAX_CHARS;
  const canSubmit = isValid && !disabled;

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!canSubmit) return;
    onSubmit(trimmed);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (canSubmit) handleSubmit();
    }
  };

  const handleExample = (topic) => {
    setValue(topic);
    textareaRef.current?.focus();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-lg">
      <form onSubmit={handleSubmit}>
        <label htmlFor="research-topic" className="block text-sm font-semibold text-text-primary mb-3">
          Research Topic
        </label>
        <div className="relative">
          <textarea
            id="research-topic"
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, MAX_CHARS))}
            onKeyDown={handleKeyDown}
            placeholder="What would you like to research today?"
            disabled={disabled}
            rows={4}
            className="w-full resize-none rounded-xl border border-border bg-base/60 px-4 py-3.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent/50 focus:ring-1 focus:ring-accent/30 outline-none transition-all disabled:opacity-50"
            aria-describedby="char-counter topic-help"
          />
          <div className="absolute bottom-2.5 right-3 pointer-events-none">
            <span id="char-counter" className={`text-xs tabular-nums ${value.length > MAX_CHARS * 0.9 ? "text-warning" : "text-text-muted"}`}>
              {value.length}/{MAX_CHARS}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
          <p id="topic-help" className="text-xs text-text-muted flex items-center gap-1.5">
            <CornerDownLeft className="h-3 w-3" />
            Press <kbd className="rounded border border-border bg-elevated px-1.5 py-0.5 text-xs font-mono">Ctrl</kbd>
            <span>+</span>
            <kbd className="rounded border border-border bg-elevated px-1.5 py-0.5 text-xs font-mono">Enter</kbd>
            to submit
          </p>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-lg gradient-accent px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none w-full sm:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            {disabled ? "Generating..." : "Generate Research"}
          </button>
        </div>
      </form>

      <div className="mt-5 pt-5 border-t border-border-subtle">
        <p className="text-xs font-medium text-text-secondary mb-2.5">Try an example:</p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => handleExample(topic)}
              disabled={disabled}
              className="rounded-full border border-border bg-elevated/50 px-3.5 py-1.5 text-xs text-text-secondary hover:text-text-primary hover:border-accent/40 hover:bg-elevated transition-all disabled:opacity-50 text-left"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
