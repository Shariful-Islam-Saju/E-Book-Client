"use client";

import React, { useState, useMemo } from "react";
import { useGetAllLeadQuery } from "@/redux/features/lead/leadApi";
import { motion } from "framer-motion";
import { RefreshCw, User, Filter, Search, Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import { TLead } from "@/types";
import LeadLoading from "./LeadLoading";
import LeadsNotFound from "./LeadsNotFound";
import LeadError from "./LeadError";
import LeadDownload from "./LeadDownload";

const LeadsPage: React.FC = () => {
  const { data, isLoading, error, refetch } = useGetAllLeadQuery(undefined);
  const leads: TLead[] = data?.data ?? [];

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

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
      const s = search.toLowerCase();
      return (
        lead.name?.toLowerCase().includes(s) ||
        lead.mobile.toLowerCase().includes(s) ||
        lead.address?.toLowerCase().includes(s) ||
        lead.ebook?.title.toLowerCase().includes(s) ||
        formatDate(lead.createdAt).toLowerCase().includes(s)
      );
    });
  }, [leads, search]);

  const toggleSelectAll = () => {
    if (selected.length === filteredLeads.length) {
      setSelected([]);
    } else {
      setSelected(filteredLeads.map((lead) => lead.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  if (error) {
    return <LeadError onRetry={refetch} errorMessage="Failed to Load Leads" />;
  }

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Fixed Top Bar */}
      <div className="fixed top-16 lg:left-60 left-0 right-0 z-10 bg-white/95 backdrop-blur-lg border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Title + Stats */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">
                Leads Management
              </h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {leads.length} Total Leads
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  {filteredLeads.length} filtered
                </span>
                {selected.length > 0 && (
                  <Badge className="bg-green-100 text-green-800">
                    {selected.length} selected
                  </Badge>
                )}
              </div>
            </div>

            {/* Search + Controls */}
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <div className="relative min-w-[280px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search leads..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 border-blue-200 focus:border-blue-400"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 border-blue-200"
                >
                  <Filter className="w-4 h-4" /> Filter
                </Button>
                <LeadDownload leads={filteredLeads} />
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className=" mx-auto pt-32 pb-12 px-6">
        {isLoading ? (
          <LeadLoading viewMode="grid" />
        ) : filteredLeads.length === 0 ? (
          <LeadsNotFound search={search} setSearch={setSearch} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto rounded-lg border border-blue-200 bg-white shadow-md"
          >
            <Table>
              <TableHeader className="bg-blue-50/80">
                <TableRow>
                  <TableHead className="w-12 text-center">
                    <Checkbox
                      checked={
                        selected.length > 0 &&
                        selected.length === filteredLeads.length
                      }
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    Mobile
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    Address
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    Interested
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    Created
                  </TableHead>
                  <TableHead className="font-semibold text-gray-800">
                    Updated
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-800">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead, idx) => (
                  <TableRow
                    key={lead.id}
                    className={`${
                      selected.includes(lead.id)
                        ? "bg-blue-50/70"
                        : idx % 2 === 0
                        ? "bg-white"
                        : "bg-slate-50/40"
                    } hover:bg-blue-100/50 transition`}
                  >
                    <TableCell className="text-center">
                      <Checkbox
                        checked={selected.includes(lead.id)}
                        onCheckedChange={() => toggleSelectOne(lead.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.mobile}</TableCell>
                    <TableCell className="truncate max-w-[200px]">
                      {lead.address}
                    </TableCell>
                    <TableCell>
                      {lead.ebook?.title ? (
                        <Badge variant="secondary">{lead.ebook.title}</Badge>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{formatDate(lead.createdAt)}</TableCell>
                    <TableCell>{formatDate(lead.updatedAt)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 text-blue-600 border-blue-200"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </Button>
                      <Button size="sm" variant="destructive" className="gap-1">
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
