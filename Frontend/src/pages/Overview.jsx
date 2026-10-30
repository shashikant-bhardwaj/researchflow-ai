import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Network,
  Bot,
  Activity,
  ServerCog,
  ArrowRight,
  Search,
  BookOpen,
  PenLine,
  CheckCheck,
} from "lucide-react";
import ResearchInput from "../components/ResearchInput";

const EXAMPLE_TOPICS = [
  "How will AI agents transform software development?",
  "The current state of renewable energy storage.",
  "Applications of large language models in healthcare.",
  "The future of cybersecurity in an AI-driven world.",
];

const INFO_CARDS = [
  {
    icon: Network,
    title: "Multi-Agent Pipeline",
    description: "Four agents collaborate in sequence to search, read, write, and critique.",
  },
  {
    icon: Bot,
    title: "Four Specialized Agents",
    description: "Each agent has a distinct role in the research synthesis workflow.",
  },
  {
    icon: Activity,
    title: "Real-Time Generation Status",
    description: "Track the pipeline progress with an illustrative agent visualization.",
  },
  {
    icon: ServerCog,
    title: "Backend Connection",
    description: "The frontend communicates with your local FastAPI research backend.",
  },
];

const AGENT_ICONS = [Search, BookOpen, PenLine, CheckCheck];
const AGENT_NAMES = ["Search", "Reader", "Writer", "Critic"];

export default function Overview({ connectionStatus, onSubmit, isGenerating }) {
  const navigate = useNavigate();

  const handleSubmit = (topic) => {
    onSubmit(topic);
    navigate("/workspace");
  };

  return (
    <div className="space-y-8">
      {/* Welcome section */}
      <section className="text-center pt-4 pb-2 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3 py-1 mb-5">
          <Sparkles className="h-3.5 w-3.5 text-accent" />
          <span className="text-xs font-medium text-accent">Multi-Agent Research Pipeline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight mb-4">
          Turn Questions Into <span className="gradient-text">Research.</span>
        </h1>
        <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed text-base">
          Investigate complex topics with a collaborative AI pipeline that searches, reads, writes, and critiques.
        </p>
      </section>

      {/* Research input */}
      <section className="max-w-3xl mx-auto w-full animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        <ResearchInput onSubmit={handleSubmit} disabled={isGenerating} />
      </section>

      {/* Start new research CTA for mobile */}
      <section className="flex justify-center lg:hidden animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
        <button
          onClick={() => navigate("/workspace")}
          className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Go to Research Workspace
          <ArrowRight className="h-4 w-4" />
        </button>
      </section>

      {/* Info cards */}
      <section className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4 text-center">
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {INFO_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="group rounded-2xl border border-border bg-card p-5 hover:border-accent/30 transition-all hover:shadow-lg hover:shadow-accent/5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-elevated border border-border group-hover:border-accent/30 transition-colors flex-shrink-0">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary mb-1">{card.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{card.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Agent flow diagram */}
      <section className="animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
        <div className="rounded-2xl border border-border bg-card p-6 max-w-4xl mx-auto">
          <h3 className="text-sm font-semibold text-text-primary text-center mb-6">The Research Pipeline</h3>
          <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto pb-2">
            {AGENT_NAMES.map((name, index) => {
              const Icon = AGENT_ICONS[index];
              return (
                <div key={name} className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  <div className="flex flex-col items-center gap-2 min-w-[60px]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-elevated">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <span className="text-xs font-medium text-text-secondary">{name}</span>
                  </div>
                  {index < AGENT_NAMES.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-text-muted flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
