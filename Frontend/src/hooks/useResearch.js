import { useCallback, useRef, useState } from "react";
import { generateResearch } from "../services/researchApi";
import { saveResearch } from "../utils/researchStorage";

export const STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  CANCELLED: "cancelled",
};

export function useResearch() {
  const [status, setStatus] = useState(STATUS.IDLE);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [topic, setTopic] = useState("");
  const abortRef = useRef(null);

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setStatus(STATUS.IDLE);
    setResult(null);
    setError(null);
    setTopic("");
  }, []);

  const cancel = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setStatus(STATUS.CANCELLED);
  }, []);

  const run = useCallback(async (researchTopic) => {
    if (!researchTopic || !researchTopic.trim()) {
      setError("A research topic is required.");
      setStatus(STATUS.ERROR);
      return null;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setTopic(researchTopic.trim());
    setStatus(STATUS.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await generateResearch(researchTopic, { signal: controller.signal });
      if (controller.signal.aborted) {
        setStatus(STATUS.CANCELLED);
        return null;
      }
      setResult(data);
      setStatus(STATUS.SUCCESS);

      // Save only after a successful backend response.
      if (data.report) {
        saveResearch({
          topic: data.topic,
          report: data.report,
          searchResult: data.searchResult,
          scrapedContent: data.scrapedContent,
          feedback: data.feedback,
        });
      }
      return data;
    } catch (err) {
      if (controller.signal.aborted || err.name === "AbortError") {
        setStatus(STATUS.CANCELLED);
        return null;
      }
      setError(err.message || "An unexpected error occurred during research.");
      setStatus(STATUS.ERROR);
      return null;
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }, []);

  const loadFromHistory = useCallback((entry) => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setTopic(entry.topic);
    setResult({
      success: true,
      topic: entry.topic,
      report: entry.report || "",
      searchResult: entry.searchResult || "",
      scrapedContent: entry.scrapedContent || "",
      feedback: entry.feedback || "",
    });
    setStatus(STATUS.SUCCESS);
    setError(null);
  }, []);

  return {
    status,
    result,
    error,
    topic,
    run,
    cancel,
    reset,
    loadFromHistory,
    setStatus,
  };
}
