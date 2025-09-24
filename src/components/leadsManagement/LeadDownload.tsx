import React from "react";
import { Button } from "../ui/button";
import { Download } from "lucide-react";
import { TLead } from "@/types";

const LeadDownload = ({ leads }: { leads: TLead[] }) => {
  const handleDownload = () => {
    console.log(leads);
  };
  return (
    <Button variant="outline" size="sm" className="gap-2 border-blue-200">
      <Download className="w-4 h-4" />
      Export
    </Button>
  );
};

export default LeadDownload;
