import EBookLibraryPage from "@/components/ebookLibrary/EBookLibraryPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "EBook Library",
  description:
    "Explore and manage your EBook library efficiently. Organize titles, track customer interactions, and streamline your workflow with our intuitive DS Ebook Leads Management system.",
};

const Page = () => {
  return <EBookLibraryPage />;
};

export default Page;
