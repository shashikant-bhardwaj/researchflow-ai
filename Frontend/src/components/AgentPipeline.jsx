import { Search, BookOpen, PenLine, CheckCheck } from "lucide-react";

export const AGENTS = [
  {
    key: "search",
    name: "Search Agent",
    icon: Search,
    description: "Finds relevant information related to the topic",
  },
  {
    key: "reader",
    name: "Reader Agent",
    icon: BookOpen,
    description: "Selects sources and extracts useful content",
  },
  {
    key: "writer",
    name: "Writer Agent",
    icon: PenLine,
    description: "Synthesizes findings into a structured report",
  },
  {
    key: "critic",
    name: "Critic Agent",
    icon: CheckCheck,
    description: "Reviews the report and provides feedback",
  },
];

export function getAgentStatus(agentIndex, pipelineStatus) {
  if (pipelineStatus === "completed") return "completed";
  if (pipelineStatus === "failed") return "failed";
  if (pipelineStatus === "loading") {
    return { 0: "running", 1: "running", 2: "running", 3: "running" }[agentIndex] || "waiting";
  }
  return "idle";
}

function AgentNode({ agent, status, index, isLast }) {
  const Icon = agent.icon;
  const statusConfig = {
    idle: { dot: "bg-text-muted", ring: "border-border", icon: "text-text-muted", bg: "bg-card" },
    running: { dot: "bg-accent animate-pulse", ring: "border-accent/40", icon: "text-accent", bg: "bg-accent/5" },
    completed: { dot: "bg-success", ring: "border-success/30", icon: "text-success", bg: "bg-success/5" },
    failed: { dot: "bg-error", ring: "border-error/30", icon: "text-error", bg: "bg-error/5" },
  };
  const cfg = statusConfig[status] || statusConfig.idle;

  return (
    <div className="relative flex flex-col items-center text-center flex-shrink-0">
      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 ${cfg.ring} ${cfg.bg} transition-all duration-300 ${
          status === "running" ? "animate-pulse-soft" : ""
        }`}
      >
        {status === "running" && (
          <div className="absolute inset-0 rounded-2xl border-2 border-accent/30 animate-ping" />
        )}
        <Icon className={`h-6 w-6 ${cfg.icon}`} />
      </div>
      <span className="mt-2 text-xs font-semibold text-text-primary whitespace-nowrap">{agent.name}</span>
      <span className="mt-1 flex items-center gap-1.5 text-xs text-text-secondary">
        <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
        <span className="capitalize">{status}</span>
      </span>
    </div>
  );
}

export default function AgentPipeline({ pipelineStatus }) {
  const isActive = pipelineStatus === "loading" || pipelineStatus === "completed";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="mb-5">
        <h3 className="text-sm font-semibold text-text-primary">Multi-Agent Pipeline</h3>
        <p className="text-xs text-text-secondary mt-1">
          {isActive
            ? "The four agents run in sequence on the backend."
            : "Agents activate when a research request is submitted."}
        </p>
      </div>

      {/* Desktop horizontal stepper */}
      <div className="hidden md:flex items-start justify-between gap-2">
        {AGENTS.map((agent, index) => (
          <div key={agent.key} className="flex items-center flex-1">
            <AgentNode agent={agent} status={getAgentStatus(index, pipelineStatus)} index={index} isLast={index === AGENTS.length - 1} />
            {index < AGENTS.length - 1 && (
              <div className="flex-1 h-0.5 mx-3 -mt-6 rounded-full bg-border relative overflow-hidden">
                <div
                  className={`absolute inset-0 transition-all duration-700 ${
                    pipelineStatus === "completed" ? "bg-success" : pipelineStatus === "loading" ? "animate-shimmer" : "bg-transparent"
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile vertical stepper */}
      <div className="md:hidden flex flex-col gap-0">
        {AGENTS.map((agent, index) => (
          <div key={agent.key} className="flex gap-4">
            <div className="flex flex-col items-center">
              <AgentNodeMobile agent={agent} status={getAgentStatus(index, pipelineStatus)} />
              {index < AGENTS.length - 1 && (
                <div className="w-0.5 flex-1 min-h-[24px] my-1 rounded-full bg-border relative overflow-hidden">
                  <div
                    className={`absolute inset-0 transition-all duration-700 ${
                      pipelineStatus === "completed" ? "bg-success" : pipelineStatus === "loading" ? "animate-shimmer" : "bg-transparent"
                    }`}
                  />
                </div>
              )}
            </div>
            <div className="flex-1 pt-2 pb-4">
              <p className="text-sm font-semibold text-text-primary">{agent.name}</p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{agent.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AgentNodeMobile({ agent, status }) {
  const Icon = agent.icon;
  const statusConfig = {
    idle: { ring: "border-border", icon: "text-text-muted", bg: "bg-card" },
    running: { ring: "border-accent/40", icon: "text-accent", bg: "bg-accent/5" },
    completed: { ring: "border-success/30", icon: "text-success", bg: "bg-success/5" },
    failed: { ring: "border-error/30", icon: "text-error", bg: "bg-error/5" },
  };
  const cfg = statusConfig[status] || statusConfig.idle;

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 ${cfg.ring} ${cfg.bg} transition-all duration-300 ${
        status === "running" ? "animate-pulse-soft" : ""
      }`}
    >
      <Icon className={`h-5 w-5 ${cfg.icon}`} />
    </div>
  );
}
