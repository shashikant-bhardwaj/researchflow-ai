import ReactMarkdown from "react-markdown";
import { Search, BookOpen, CheckCircle2, FileText, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "./Toast";
import { NoContentState } from "./EmptyState";

const TABS = [
  { key: "report", label: "Final Report", icon: FileText },
  { key: "search", label: "Search Results", icon: Search },
  { key: "content", label: "Extracted Content", icon: BookOpen },
  { key: "feedback", label: "Critic Feedback", icon: CheckCircle2 },
];

export default function ResultTabs({ result }) {
  const [activeTab, setActiveTab] = useState("report");

  if (!result) return null;

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Tab navigation */}
      <div className="flex items-center gap-1 border-b border-border bg-surface/50 px-2 overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              role="tab"
              aria-selected={active}
              className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium whitespace-nowrap transition-all ${
                active ? "text-accent" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 gradient-accent rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="p-5 sm:p-6" role="tabpanel">
        {activeTab === "report" && <ReportTab result={result} />}
        {activeTab === "search" && <SearchTab result={result} />}
        {activeTab === "content" && <ContentTab result={result} />}
        {activeTab === "feedback" && <FeedbackTab result={result} />}
      </div>
    </div>
  );
}

function ReportTab({ result }) {
  return <ReportMarkdown content={result.report} emptyMessage="No report was generated for this request." />;
}

function SearchTab({ result }) {
  return <ReportMarkdown content={result.searchResult} emptyMessage="No search results were returned." />;
}

function ContentTab({ result }) {
  const { show } = useToast();
  const [copied, setCopied] = useState(false);

  const content = result.scrapedContent;
  const hasContent = content && content.trim().length > 0;

  const handleCopy = async () => {
    if (!hasContent) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      show("Extracted content copied", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      show("Unable to copy content", "error");
    }
  };

  if (!hasContent) {
    return <NoContentState icon={BookOpen} message="No extracted content was returned from the reader agent." />;
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-accent" />
          Extracted Source Content
        </h3>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-elevated px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:border-accent/40 transition-all"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <div className="max-h-[600px] overflow-y-auto rounded-xl border border-border bg-base/50 p-4">
        <pre className="text-xs text-text-secondary whitespace-pre-wrap break-words font-mono leading-relaxed">{content}</pre>
      </div>
    </div>
  );
}

function FeedbackTab({ result }) {
  const content = result.feedback;
  const hasContent = content && content.trim().length > 0;

  if (!hasContent) {
    return <NoContentState icon={CheckCircle2} message="No critic feedback was returned for this report." />;
  }

  return (
    <div className="animate-fade-in">
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-4 mb-4">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 border border-accent/20">
            <CheckCircle2 className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary">Critic Agent Review</h3>
            <p className="text-xs text-text-secondary mt-0.5">Feedback on the generated research report</p>
          </div>
        </div>
      </div>
      <div className="report-prose">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
}

function ReportMarkdown({ content, emptyMessage }) {
  const hasContent = content && content.trim().length > 0;

  if (!hasContent) {
    return <NoContentState message={emptyMessage} />;
  }

  return (
    <div className="report-prose animate-fade-in">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
