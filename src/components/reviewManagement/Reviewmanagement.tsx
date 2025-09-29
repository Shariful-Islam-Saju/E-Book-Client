"use client";

import React, { useState, useEffect } from "react";
import { useGetAllReviewsQuery } from "@/redux/features/review/reviewApi";
import {  Plus } from "lucide-react";
import { toast } from "sonner";
import ReviewTable from "./ReviewTable";
import CreateReviewModal from "./CreateReviewModal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import LeadLoading from "../leadsManagement/LeadLoading";

const ReviewLibraryPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useGetAllReviewsQuery();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  // Filter reviews by title or reviewer name
  const filteredData = data?.data?.filter(
    (review) =>
      review.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      review.reviewBy.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error("Failed to load reviews. Please try again.");
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Review Library</h1>

        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Search reviews..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs border border-green-300 rounded px-3 py-2 focus:ring-1 focus:ring-green-400"
          />
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <Plus className="w-5 h-5" /> Add Review
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
      <LeadLoading />
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="flex flex-col items-center py-20 text-red-600">
          <p className="mb-2">Failed to load reviews.</p>
          <Button
            onClick={refetch}
            className="px-4 py-2 border rounded text-green-600 hover:bg-green-50"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && filteredData && (
        <ReviewTable reviews={filteredData} />
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <CreateReviewModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default ReviewLibraryPage;
