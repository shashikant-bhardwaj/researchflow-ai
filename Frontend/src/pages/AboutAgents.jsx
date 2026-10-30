import { Search, BookOpen, PenLine, CheckCheck, ArrowRight, Bot } from "lucide-react";

const AGENTS = [
  {
    name: "Search Agent",
    icon: Search,
    purpose: "Finds relevant information related to the user's topic.",
    detail: "The search agent queries the web for sources that may contain useful information about the research topic.",
  },
  {
    name: "Reader Agent",
    icon: BookOpen,
    purpose: "Selects relevant pages and extracts useful content.",
    detail: "The reader agent evaluates the search results, picks the most relevant sources, and extracts readable content from them.",
  },
  {
    name: "Writer Agent",
    icon: PenLine,
    purpose: "Synthesizes the available information into a structured report.",
    detail: "The writer agent takes the extracted content and composes a coherent, structured research report in Markdown.",
  },
  {
    name: "Critic Agent",
    icon: CheckCheck,
    purpose: "Reviews the generated report and provides feedback.",
    detail: "The critic agent evaluates the report for quality, completeness, and accuracy, then returns feedback for improvement.",
  },
];

const FLOW_STEPS = [
  "Research Topic",
  "Search Agent",
  "Reader Agent",
  "Writer Agent",
  "Critic Agent",
  "Research Output",
];

export default function AboutAgents() {
  return (
    <div className="space-y-8 py-2">
      {/* Page header */}
      <div className="animate-fade-in-up text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 mb-4">
          <Bot className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-medium text-accent">Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-3">
          The Four-Agent Research Pipeline
        </h1>
        <p className="text-text-secondary leading-relaxed">
          ResearchFlow AI uses a multi-agent architecture where specialized agents collaborate to search,
          read, write, and critique. Each agent handles one stage of the research process.
        </p>
      </div>

      {/* Pipeline diagram */}
      <div className="rounded-2xl border border-border bg-card p-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-5 text-center">
          Pipeline Flow
        </h2>
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2">
          {FLOW_STEPS.map((step, index) => (
            <div key={step} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-medium whitespace-nowrap ${
                    index === 0 || index === FLOW_STEPS.length - 1
                      ? "border-accent/30 bg-accent/10 text-accent"
                      : "border-border bg-elevated text-text-secondary"
                  }`}
                >
                  {step}
                </div>
              </div>
              {index < FLOW_STEPS.length - 1 && (
                <ArrowRight className="h-3.5 w-3.5 text-text-muted flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Agent cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
        {AGENTS.map((agent, index) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.name}
              className="group rounded-2xl border border-border bg-card p-5 hover:border-accent/30 transition-all hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${0.15 + index * 0.05}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-elevated border border-border group-hover:border-accent/30 transition-colors flex-shrink-0">
                  <Icon className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-text-muted">Agent {index + 1}</span>
                  </div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">{agent.name}</h3>
                  <p className="text-sm text-accent font-medium mb-2">{agent.purpose}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{agent.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="rounded-xl border border-border bg-surface/50 px-5 py-4 max-w-3xl mx-auto text-center">
        <p className="text-xs text-text-muted leading-relaxed">
          The agents run sequentially on your local Python FastAPI backend. The frontend sends the topic,
          receives the completed result, and displays it. Intermediate agent states shown in the UI are
          illustrative progress indicators, not confirmed live events streamed from the server.
        </p>
      </div>
    </div>
  );
}
