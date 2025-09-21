"use client";

import React, { useEffect } from "react";
import EBooksPage from "@/components/ebook/EBooksPage";
import { useTracking } from "@/components/TrackingProvider";

const Page = () => {
  const { trackPageView } = useTracking();

  useEffect(() => {
    trackPageView("Individual EBook Page");
  }, [trackPageView]);

  return <EBooksPage />;
};

export default Page;
