"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetSingleFileQuery } from "@/redux/features/file/fileApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const EBooksPage = () => {
  const params = useParams();
  let id = params?.id;
  if (Array.isArray(id)) {
    id = id[0];
  }

  // Only fetch if id exists
  const {
    data: file,
    isLoading,
    isError,
  } = useGetSingleFileQuery(id ?? "");

  if (!id) {
    return <div>No file ID provided</div>;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Skeleton className="w-96 h-48 rounded-lg" />
      </div>
    );
  }

  if (isError || !file) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-semibold text-slate-700"
        >
          No file found
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center p-4"
    >
      <Card className="w-full max-w-2xl shadow-lg border border-slate-700 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-2xl text-white">{file.title}</CardTitle>
          <CardDescription className="text-slate-300">
            {file.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4 text-slate-200">
          <p>
            <strong>Author:</strong> {file.author || "Unknown"}
          </p>
          <p>
            <strong>Published:</strong> {file.publishedAt || "N/A"}
          </p>
          <p>
            <strong>Category:</strong> {file.category || "N/A"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EBooksPage;
