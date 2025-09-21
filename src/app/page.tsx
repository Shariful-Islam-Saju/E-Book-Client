"use client";

import { useEffect } from "react";
import UnderConstruction from "@/components/Upcoming";
import { useTracking } from "@/components/TrackingProvider";

export default function Home() {
  const { trackPageView } = useTracking();

  useEffect(() => {
    trackPageView("Home Page");
  }, [trackPageView]);

  return <UnderConstruction />;
}
