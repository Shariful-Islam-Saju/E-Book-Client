"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { trackingManager } from "@/lib/tracking";
import "@/lib/debug-tracking"; // Import debug utility

interface TrackingContextType {
  trackPageView: (pageName?: string) => void;
  trackLead: (formName?: string) => void;
  trackEbookView: (
    ebookTitle: string,
    ebookId: string,
    price?: number,
    currency?: string
  ) => void;
  trackEbookDownload: (
    ebookTitle: string,
    ebookId: string,
    value?: number,
    currency?: string
  ) => void;
  trackRegistration: () => void;
}

const TrackingContext = createContext<TrackingContextType | undefined>(
  undefined
);

interface TrackingProviderProps {
  children: ReactNode;
}

export function TrackingProvider({ children }: TrackingProviderProps) {
  useEffect(() => {
    // Initialize tracking on client side
    trackingManager.initialize();
  }, []);

  const contextValue: TrackingContextType = {
    trackPageView: (pageName?: string) =>
      trackingManager.trackPageView(pageName),
    trackLead: (formName?: string) => trackingManager.trackLead(formName),
    trackEbookView: (
      ebookTitle: string,
      ebookId: string,
      price?: number,
      currency?: string
    ) => trackingManager.trackEbookView(ebookTitle, ebookId, price, currency),
    trackEbookDownload: (
      ebookTitle: string,
      ebookId: string,
      value?: number,
      currency?: string
    ) =>
      trackingManager.trackEbookDownload(ebookTitle, ebookId, value, currency),
    trackRegistration: () => trackingManager.trackRegistration(),
  };

  return (
    <TrackingContext.Provider value={contextValue}>
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error("useTracking must be used within a TrackingProvider");
  }
  return context;
}
