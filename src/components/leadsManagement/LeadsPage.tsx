"use client";

import React, { useState } from "react";
import {
  useGetAllLeadQuery,
  useDeleteLeadMutation,
} from "@/redux/features/lead/leadApi";
import { User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LeadLoading from "./LeadLoading";
import LeadsNotFound from "./LeadsNotFound";
import LeadError from "./LeadError";
import LeadTable from "./LeadTable";
import LeadDownload from "./LeadDownload";
import DeleteConfirmModal from "../ConfirmationModal";

import { TLead } from "@/types";
import { toast } from "sonner";
import { MultiSelect } from "react-multi-select-component";

const dummyEbooks = [
  { label: "JavaScript Basics", value: "ebook1" },
  { label: "React Advanced", value: "ebook2" },
  { label: "Node.js Guide", value: "ebook3" },
  { label: "DSA in JS", value: "ebook4" },
];

const limitOptions = [100, 200, 500];

const LeadsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedEbooks, setSelectedEbooks] = useState<
    { label: string; value: string }[]
  >([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useGetAllLeadQuery({
    search,
    fromDate,
    toDate,
    ebookIds: selectedEbooks.map((eb) => eb.value),
    page,
    limit,
  });

  const [deleteLead] = useDeleteLeadMutation();
  const leads: TLead[] = data?.data ?? [];
  const total = leads.length ?? 0;
  const totalPages = Math.ceil(total / limit);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleDelete = async (id: string) => {
    try {
      await deleteLead(id).unwrap();
      setSelected((prev) => prev.filter((sid) => sid !== id));
      refetch();
      toast.success("Lead deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete lead.");
    } finally {
      setDeleteId(null);
    }
  };

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
              <MultiSelect
                options={dummyEbooks}
                value={selectedEbooks}
                onChange={setSelectedEbooks}
                labelledBy="Select Ebook"
                overrideStrings={{ selectSomeItems: "Select Ebook" }}
                className="w-full"
              />
            </div>

            {/* Download Button */}
            <div className="flex items-end">
              <LeadDownload leads={leads} />
            </div>

            {/* Limit Selector */}
            <div className="flex flex-col min-w-[120px] flex-1">
              <label className="text-sm text-gray-600 mb-1">
                Rows per page
              </label>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="h-10 border border-blue-200 rounded px-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
              >
                {limitOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt} per page
                  </option>
                ))}
              </select>
            </div>
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
              handleDelete={(id: string) => setDeleteId(id)}
              formatDate={formatDate}
            />

            {/* Pagination */}
            <div className="flex justify-center mt-6 items-center gap-2 flex-wrap">
              <Button
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                size="sm"
                variant="outline"
              >
                Prev
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  size="sm"
                  variant={p === page ? "default" : "outline"}
                  className={p === page ? "bg-blue-600 text-white" : ""}
                >
                  {p}
                </Button>
              ))}

              <Button
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                size="sm"
                variant="outline"
              >
                Next
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <DeleteConfirmModal
          isOpen={!!deleteId}
          onCancel={() => setDeleteId(null)}
          onConfirm={() => handleDelete(deleteId)}
          title="Delete Lead"
          description="Are you sure you want to delete this lead? This action cannot be undone."
        />
      )}
    </div>
  );
};

export default LeadsPage;
