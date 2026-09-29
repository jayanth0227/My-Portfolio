"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { DEFAULT_PORTFOLIO_CONTENT, PortfolioContentData } from "@/lib/contentDefaults";

interface PortfolioContentContextType {
  content: PortfolioContentData;
  loading: boolean;
  refreshContent: () => Promise<void>;
  updateContentState: (updater: (prev: PortfolioContentData) => PortfolioContentData) => void;
}

const PortfolioContentContext = createContext<PortfolioContentContextType>({
  content: DEFAULT_PORTFOLIO_CONTENT,
  loading: false,
  refreshContent: async () => {},
  updateContentState: () => {},
});

export function PortfolioContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<PortfolioContentData>(DEFAULT_PORTFOLIO_CONTENT);
  const [loading, setLoading] = useState(true);

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(`/api/content?_t=${Date.now()}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.content) {
          setContent((prev) => ({
            ...prev,
            ...data.content,
            navbar: { ...prev.navbar, ...data.content.navbar },
            hero: { ...prev.hero, ...data.content.hero },
            about: { ...prev.about, ...data.content.about },
            experience: Array.isArray(data.content.experience)
              ? data.content.experience
              : prev.experience,
          }));
        }
      }
    } catch (err) {
      console.error("Failed to load portfolio content:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
    const handleUpdate = () => {
      fetchContent();
    };
    window.addEventListener("portfolio-content-updated", handleUpdate);
    return () => {
      window.removeEventListener("portfolio-content-updated", handleUpdate);
    };
  }, [fetchContent]);

  const updateContentState = useCallback((updater: (prev: PortfolioContentData) => PortfolioContentData) => {
    setContent(updater);
  }, []);

  return (
    <PortfolioContentContext.Provider
      value={{
        content,
        loading,
        refreshContent: fetchContent,
        updateContentState,
      }}
    >
      {children}
    </PortfolioContentContext.Provider>
  );
}

export function usePortfolioContent() {
  const ctx = useContext(PortfolioContentContext);
  if (!ctx) {
    return {
      content: DEFAULT_PORTFOLIO_CONTENT,
      loading: false,
      refreshContent: async () => {},
      updateContentState: () => {},
    };
  }
  return ctx;
}
