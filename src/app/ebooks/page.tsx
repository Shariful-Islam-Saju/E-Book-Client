"use client";

import AllEbooksPage from "@/components/ebook/allEBooks/AllEBooksPage";
import React, { useEffect } from "react";
import { useTracking } from "@/components/TrackingProvider";

const Page = () => {
  const { trackPageView } = useTracking();

  useEffect(() => {
    trackPageView("EBooks List Page");
  }, [trackPageView]);

  return <AllEbooksPage />;
};

export default Page;
