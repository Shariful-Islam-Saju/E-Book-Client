"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useGetSingleFileQuery } from "@/redux/features/file/fileApi";
import { TEBook } from "@/types";
import { Star, ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Reviews from "../Reviews";
import LeadForm from "../LeadForm";
import EbookPageSkeleton from "./EbookPageSkeleton";
import NoEbookFound from "./NoEbookFound";
import DownloadCounter from "./DownloadCounter";

const EBooksPage: React.FC = () => {
  const params = useParams();
  let id = params?.id;
  if (Array.isArray(id)) id = id[0];

  const { data: rawFile, isLoading, isError } = useGetSingleFileQuery(id ?? "");
  const file: TEBook | null = rawFile?.data ?? null;
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (file?.coverImage) {
      const img = new Image();
      img.src = file.coverImage;
      img.onload = () => setImageLoaded(true);
    }
  }, [file]);

  if (!id)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No file ID provided.
      </div>
    );
  if (isLoading) return <EbookPageSkeleton />;
  if (isError || !file) return <NoEbookFound />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row gap-8 items-center mb-16">
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-[50%] max-w-md">
              <motion.div
                className="absolute inset-0 bg-blue-200 rounded-2xl transform rotate-3"
                animate={{ rotate: 3 }}
              />
              <motion.div
                className="absolute inset-0 bg-blue-100 rounded-2xl transform -rotate-3"
                animate={{ rotate: -3 }}
              />
              <motion.img
                src={"/placeholder-ebook.png"}
                alt={file.title}
                className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </motion.div>
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="  p-6 mb-6 "
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="inline-block px-3 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded-full mb-4">
                Bestseller
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-4 leading-tight">
                {file.title}
              </h1>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {file.description || "No description available."}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className="fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="ml-2 text-slate-700 font-medium">5</span>
                </div>
              </div>

              <motion.a
                href={"#lead-form"}
                rel="noreferrer"
                className="inline-flex items-center px-5 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download
                <ArrowRight size={18} className="ml-2" />
              </motion.a>
            </motion.div>
          </motion.div>
        </section>

        {/* Download Form Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div
            className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
            id="lead-form"
          >
            {/* Lead Form */}
            <div className="lg:w-2/3 bg-white p-8">
              <LeadForm ebookId={file.id} downloadUrl={file.url} />
            </div>

            {/* Download Counter */}
            <div className="lg:w-1/3 bg-white p-8">
              <DownloadCounter />
            </div>
          </div>
        </motion.section>

        {/* Reviews Section */}
      </div>
      <motion.section
        className="mb-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-4">
          What Readers Are Saying
        </h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Discover why thousands of readers have made this ebook their go-to
          resource.
        </p>

        <Reviews reviews={file.reviews ?? []} />
      </motion.section>
    </div>
  );
};

export default EBooksPage;
