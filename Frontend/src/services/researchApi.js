const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const RESEARCH_TIMEOUT_MS = 180000;
const HEALTH_TIMEOUT_MS = 8000;

function buildUrl(path) {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const cleanPath = path.replace(/^\/+/, "");

  return `${base}/${cleanPath}`;
}

async function parseError(response) {
  let detail = `HTTP ${response.status} ${response.statusText}`;
  try {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await response.json();
      if (body?.detail) {
        detail = typeof body.detail === "string"
          ? body.detail
          : JSON.stringify(body.detail);
      } else if (body?.message) {
        detail = body.message;
      }
    } else {
      const text = await response.text();
      if (text && text.length < 500) detail = text;
    }
  } catch {
    // keep default detail
  }
  return detail;
}

export async function checkBackendHealth(signal) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), HEALTH_TIMEOUT_MS);

  const combinedSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const response = await fetch(buildUrl("/"), {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: combinedSignal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      return { connected: false, status: response.status };
    }
    return { connected: true, status: response.status };
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      return { connected: false, aborted: true };
    }
    return { connected: false, error: err.message };
  }
}

export async function generateResearch(topic, { signal } = {}) {
  if (!topic || !topic.trim()) {
    throw new Error("A research topic is required.");
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), RESEARCH_TIMEOUT_MS);

  const combinedSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  let response;
  try {
    response = await fetch(buildUrl("/research"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ topic: topic.trim() }),
      signal: combinedSignal,
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new Error("The research request was cancelled or timed out.");
    }
    throw new Error(
      "Unable to reach the research backend. Please verify the Python FastAPI server is running and accessible."
    );
  }

  clearTimeout(timeoutId);

  if (!response.ok) {
    const detail = await parseError(response);
    const error = new Error(detail);
    error.status = response.status;
    if (response.status === 400 || response.status === 422) {
      error.kind = "validation";
    } else if (response.status >= 500) {
      error.kind = "server";
    }
    throw error;
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The backend returned an invalid or unreadable response.");
  }

  if (!data || data.success === false) {
    const msg = data?.error || data?.message || "The research pipeline did not complete successfully.";
    throw new Error(msg);
  }

  return {
    success: true,
    topic: data.topic || topic.trim(),
    searchResult: data.search_result || "",
    scrapedContent: data.scraped_content || "",
    report: data.report || "",
    feedback: data.feedback || "",
  };
}

