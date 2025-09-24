"use client";

import React, { useState, useMemo } from "react";
import { useGetAllLeadQuery } from "@/redux/features/lead/leadApi";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, User, List, Grid, Download, Filter, Search } from "lucide-react";
import { TLead } from "@/types";
import LeadLoading from "./LeadLoading";
import LeadsNotFound from "./LeadsNotFound";
import LeadCard from "./LeadCard";
import LeadError from "./LeadError";

const LeadsPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetAllLeadQuery(undefined);
  const leads: TLead[] = data?.data ?? [];
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "row">("row");

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchLower = search.toLowerCase();
      return (
        lead.name?.toLowerCase().includes(searchLower) ||
        lead.mobile.toLowerCase().includes(searchLower) ||
        lead.address?.toLowerCase().includes(searchLower) ||
        lead.ebook?.title.toLowerCase().includes(searchLower) ||
        formatDate(lead.createdAt).toLowerCase().includes(searchLower)
      );
    });
  }, [leads, search]);

  if (error) {
    return (
      <LeadError onRetry={refetch} errorMessage={"Failed to Load Leads"} />
    );
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Fixed Top Section */}
      <div className="fixed top-16 lg:left-60 left-0 right-0  z-10 bg-white/95 backdrop-blur-lg border-b border-blue-200 shadow-sm">
        <div className="px-14 mx-auto p-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Page Title and Stats */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Leads Management
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {leads.length} Total Leads
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {filteredLeads.length} filtered
                </span>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search Bar */}
              <div className="relative min-w-[300px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border-blue-200 focus:border-blue-400"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-200"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-200"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
                <Button
                  onClick={() => refetch()}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-200"
                  disabled={isLoading}
                >
                  <RefreshCw
                    className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "row" : "grid")
                  }
                  className="gap-2 border-blue-200"
                >
                  {viewMode === "grid" ? (
                    <>
                      <List className="w-4 h-4" />
                      List
                    </>
                  ) : (
                    <>
                      <Grid className="w-4 h-4" />
                      Grid
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area with Padding for Fixed Header */}
      <div className="pt-32 pb-8 px-4 mx-auto">
        {isLoading ? (
          <LeadLoading viewMode="grid" />
        ) : filteredLeads.length === 0 ? (
          <LeadsNotFound search={search} setSearch={setSearch} />
        ) : viewMode === "grid" ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredLeads.map((lead: TLead) => (
              <motion.div
                key={lead.id}
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
                }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <LeadCard lead={lead} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredLeads.map((lead: TLead) => (
              <LeadCard key={lead.id} lead={lead} row />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
