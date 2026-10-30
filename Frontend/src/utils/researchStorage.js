const STORAGE_KEY = "researchflow_history_v1";
const MAX_ENTRIES = 20;

function safeParse(json) {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = safeParse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry) =>
        entry &&
        typeof entry === "object" &&
        typeof entry.id === "string" &&
        typeof entry.topic === "string"
    );
  } catch {
    return [];
  }
}

function persist(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage may be full or unavailable; fail silently
  }
}

export function saveResearch(entry) {
  const history = loadHistory();
  const record = {
    id: entry.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    topic: entry.topic,
    report: entry.report || "",
    searchResult: entry.searchResult || "",
    scrapedContent: entry.scrapedContent || "",
    feedback: entry.feedback || "",
    timestamp: entry.timestamp || new Date().toISOString(),
  };
  const updated = [record, ...history].slice(0, MAX_ENTRIES);
  persist(updated);
  return record;
}

export function deleteResearch(id) {
  const history = loadHistory();
  const updated = history.filter((entry) => entry.id !== id);
  persist(updated);
  return updated;
}

export function clearHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // fail silently
  }
}

export function getResearchById(id) {
  const history = loadHistory();
  return history.find((entry) => entry.id === id) || null;
}

export function formatTimestamp(iso) {
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
