import LeadsPage from "@/components/leadsManagement/LeadsPage";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Leads Management",
  description:
    "Easily manage, organize, and track all customer leads in one place. Streamline your workflow, monitor progress, and boost conversions with the DS Ebook Leads Management system.",
};

const Page = () => {
  return <LeadsPage/>
};

export default Page;
