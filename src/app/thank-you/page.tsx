import ThankYou from "@/components/ThankYou";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Thank You | DS EBooks",
  description:
    "ধন্যবাদ! আপনি সফলভাবে আমাদের ইবুক ডাউনলোড ফর্ম পূরণ করেছেন। DS EBooks এ আপনার যাত্রা শুরু হলো আরও সহজ এবং আনন্দদায়কভাবে।",
};

const Page = () => {
  return <ThankYou />;
};

export default Page;
