import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  FlaskConical,
  History,
  Bot,
  Plus,
  X,
  Network,
  Moon,
  Sun,
} from "lucide-react";
import { ConnectionIndicator } from "./ConnectionIndicator";

const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/workspace", label: "Research Workspace", icon: FlaskConical },
  { to: "/history", label: "Research History", icon: History },
  { to: "/agents", label: "About the Agents", icon: Bot },
];

export default function Sidebar({ connectionStatus, onNewResearch, theme = "light", onToggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNewResearch = () => {
    onNewResearch?.();
    setMobileOpen(false);
  };

  const handleClose = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-border bg-surface/80 backdrop-blur-md px-4 h-14">
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-accent" />
          <span className="font-semibold text-text-primary text-sm">ResearchFlow AI</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center justify-center h-9 w-9 rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary transition-colors"
          aria-label="Open navigation menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={handleClose}
        />
      )}

      {/* Sidebar — mobile drawer + desktop fixed */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 flex flex-col border-r border-border bg-surface
          transition-transform duration-300 ease-out
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo header */}
        <div className="flex items-center justify-between px-5 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent shadow-lg shadow-accent/20">
              <Network className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-text-primary leading-tight">ResearchFlow AI</h1>
              <p className="text-xs text-text-secondary leading-tight mt-0.5">Intelligence through collaboration.</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="lg:hidden flex items-center justify-center h-8 w-8 rounded-lg text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* New Research button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleNewResearch}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg gradient-accent px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/20 hover:opacity-90 hover:shadow-accent/30 transition-all"
          >
            <Plus className="h-4 w-4" />
            New Research
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-text-muted">Navigation</p>
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={handleClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "bg-accent/10 text-accent border border-accent/20"
                          : "text-text-secondary hover:text-text-primary hover:bg-elevated border border-transparent"
                      }`
                    }
                  >
                    <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                    {item.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom section */}
        <div className="px-4 pb-5 pt-3 space-y-3 border-t border-border-subtle">
          <button
            type="button"
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between rounded-lg border border-border bg-card/60 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-elevated transition-colors"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            aria-pressed={theme === "dark"}
          >
            <span className="flex items-center gap-2">
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {theme === "light" ? "Dark mode" : "Light mode"}
            </span>
            <span className={`theme-switch ${theme === "dark" ? "is-dark" : ""}`} aria-hidden="true">
              <span />
            </span>
          </button>
          <ConnectionIndicator status={connectionStatus} />
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card/50 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-elevated border border-border">
              <Bot className="h-4 w-4 text-text-secondary" />
            </div>
            <div>
              <p className="text-xs font-medium text-text-primary leading-tight">AI Research Workspace</p>
              <p className="text-xs text-text-muted leading-tight mt-0.5">Local session</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
