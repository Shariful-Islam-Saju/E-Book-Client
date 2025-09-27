"use client";

import React, { useState, useEffect } from "react";
import { useGetAllLeadQuery } from "@/redux/features/lead/leadApi";
import { User } from "lucide-react";
import { Input } from "@/components/ui/input";
import LeadLoading from "./LeadLoading";
import LeadsNotFound from "./LeadsNotFound";
import LeadError from "./LeadError";
import LeadTable from "./LeadTable";
import LeadDownload from "./LeadDownload";

import { TLead } from "@/types";
import AllEbookDropdown from "./AllEbookDropdown";
import RowsPerPage from "../RowPerPage";
import Pagination from "../Pagination";

const LeadsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Inputs for UI
  const [fromDate, setFromDate] = useState(
    yesterday.toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(today.toISOString().split("T")[0]);

  // When sending to API
  const fromDateTime = new Date(fromDate);
  const toDateTime = new Date(toDate);
  toDateTime.setHours(23, 59, 59, 999);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // debounced value

  const [selectedEbooks, setSelectedEbooks] = useState<
    { label: string; value: string }[]
  >([]);
  const [selected, setSelected] = useState<string[]>([]);

  // Debounce search input for 3 seconds
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 3000);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);

  const { data, isLoading, error, refetch } = useGetAllLeadQuery({
    search: debouncedSearch,
    fromDate: fromDateTime.toISOString(),
    toDate: toDateTime.toISOString(),
    ebookIds: selectedEbooks.map((eb) => eb.value),
    page,
    limit,
  });

  const leads: TLead[] = data?.data?.data ?? [];
  const total = data?.data?.total ?? 0; // <-- get total from backend
  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  if (error)
    return <LeadError onRetry={refetch} errorMessage="Failed to load leads." />;

  return (
    <div className="min-h-[80vh] bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Bar */}
      <div className="fixed top-16 lg:left-60 left-0 right-0 z-10 bg-white/95 backdrop-blur-lg border-b border-blue-200 shadow-sm">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col lg:flex-row justify-between items-start gap-4">
          {/* Title & Stats */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Leads Management
            </h1>
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                <User className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-700">
                  {total} Total Leads
                </span>
              </div>
              {selected.length > 0 && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {selected.length} selected
                </span>
              )}
            </div>
          </div>

          {/* Filters & Actions */}
          <div className="flex flex-wrap gap-3 w-full lg:w-auto items-end">
            {/* Shared input style */}
            <div className="flex flex-col min-w-[200px] flex-1">
              <Input
                placeholder="Search leads..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 border-blue-200 focus:border-blue-400 w-full"
              />
            </div>

            {/* From Date */}
            <div className="flex flex-col min-w-[150px] flex-1">
              <label className="text-sm text-gray-600 mb-1">From</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="h-10 border-blue-200 w-full"
              />
            </div>

            {/* To Date */}
            <div className="flex flex-col min-w-[150px] flex-1">
              <label className="text-sm text-gray-600 mb-1">To</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="h-10 border-blue-200 w-full"
              />
            </div>

            {/* Ebook MultiSelect */}
            <div className="flex flex-col min-w-[200px] flex-1">
              <label className="text-sm text-gray-600 mb-1">
                Select Ebook(s)
              </label>
              <AllEbookDropdown
                selectedEbooks={selectedEbooks}
                setSelectedEbooks={setSelectedEbooks}
              />
            </div>

            {/* Download Button */}
            <div className="flex items-end">
              <LeadDownload leads={leads} />
            </div>

            {/* Limit Selector */}
            <RowsPerPage limit={limit} setLimit={setLimit} setPage={setPage} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mx-auto pt-32 pb-12 px-6">
        {isLoading ? (
          <LeadLoading viewMode="grid" />
        ) : leads.length === 0 ? (
          <LeadsNotFound search={search} setSearch={setSearch} />
        ) : (
          <>
            <LeadTable
              leads={leads}
              selected={selected}
              setSelected={setSelected}
              formatDate={formatDate}
            />

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default LeadsPage;
