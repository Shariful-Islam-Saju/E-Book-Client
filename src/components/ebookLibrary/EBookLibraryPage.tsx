"use client";

import React, { useState, useEffect } from "react";
import { useGetAllFilesQuery } from "@/redux/features/file/fileApi";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import EBookTable from "./EBookTable";
import CreateEBookModal from "./CreateEBookModal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const EBookLibraryPage = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, error, refetch } = useGetAllFilesQuery();

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(handler);
  }, [search]);

  const filteredData = data?.data?.filter((ebook) =>
    ebook.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error("Failed to load ebooks. Please try again.");
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">EBook Library</h1>

        <div className="flex items-center gap-3">
          <Input
            type="text"
            placeholder="Search ebooks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs border border-blue-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-400"
          />
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" /> Add EBook
          </Button>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="flex flex-col items-center py-20 text-red-600">
          <p className="mb-2">Failed to load ebooks.</p>
          <button
            onClick={refetch}
            className="px-4 py-2 border rounded text-blue-600 hover:bg-blue-50"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && filteredData && (
        <EBookTable ebooks={filteredData} />
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <CreateEBookModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

export default EBookLibraryPage;
