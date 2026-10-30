import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import { ToastProvider } from "./components/Toast";
import { useConnectionStatus } from "./hooks/useConnectionStatus";
import { useResearch } from "./hooks/useResearch";
import Overview from "./pages/Overview";
import ResearchWorkspace from "./pages/ResearchWorkspace";
import ResearchHistory from "./pages/ResearchHistory";
import AboutAgents from "./pages/AboutAgents";

function AppContent() {
  const { status: connectionStatus } = useConnectionStatus();
  const research = useResearch();
  const navigate = useNavigate();
  const [newResearchKey, setNewResearchKey] = useState(0);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("researchflow_theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem("researchflow_theme", theme);
    } catch {
      // Theme still works for the current session if storage is unavailable.
    }
  }, [theme]);

  // Start research exactly once from the Overview form.
  const handleQuickSubmit = (topic) => {
    research.run(topic);
    navigate("/workspace");
  };

  // A new research session clears the previous in-memory result.
  const handleNewResearch = () => {
    research.reset();
    setNewResearchKey((key) => key + 1);
    navigate("/", { replace: false });
  };

  return (
    <div className="min-h-screen bg-base">
      <Sidebar
        connectionStatus={connectionStatus}
        onNewResearch={handleNewResearch}
        theme={theme}
        onToggleTheme={() => setTheme((current) => current === "light" ? "dark" : "light")}
      />
      <main className="lg:ml-72 min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 py-6 lg:py-8">
          <Routes>
            <Route
              path="/"
              element={
                <Overview
                  key={newResearchKey}
                  connectionStatus={connectionStatus}
                  onSubmit={handleQuickSubmit}
                  isGenerating={research.status === "loading"}
                />
              }
            />
            <Route
              path="/workspace"
              element={
                <ResearchWorkspace
                  research={research}
                  onNewResearch={handleNewResearch}
                />
              }
            />
            <Route path="/history" element={<ResearchHistory />} />
            <Route path="/agents" element={<AboutAgents />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
