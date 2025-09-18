"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion, Variants, easeOut } from "framer-motion";
import { useGetSingleFileQuery } from "@/redux/features/file/fileApi";
import { TEBook } from "@/types";
import { ArrowRight } from "lucide-react";
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

  if (!id)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No file ID provided.
      </div>
    );
  if (isLoading) return <EbookPageSkeleton />;
  if (isError || !file) return <NoEbookFound />;

  // Scroll-from-bottom animation variant
  const fadeUpVariant: Variants = {
    hidden: { opacity: 0, y: 60, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: easeOut },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative mb-14 isolate bg-[#2f3237]">
        <div className="mx-auto max-w-6xl py-16 lg:py-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Image first for mobile */}
            <motion.div
              className="order-1 lg:order-1"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUpVariant}
            >
              <div className="relative mx-auto w-[70%] max-w-md">
                <motion.img
                  src={"/placeholder-ebook.png"}
                  alt={file.title}
                  className="relative z-10 w-full h-auto object-cover "
                  style={{boxShadow:"6px 6px 12px rgba(0,0,0 )"}}
                  loading="eager"
                  decoding="async"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.8, ease: easeOut }}
                />
              </div>
            </motion.div>

            <motion.div
              className="order-2 lg:order-2 text-center lg:text-left"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              variants={fadeUpVariant}
            >
              {" "}
              <h1 className="text-4xl/[1.15] sm:text-5xl/[1.1] font-extrabold text-gray-100 tracking-tight mb-5">
                {" "}
                {file.title}{" "}
              </h1>{" "}
              <p className="mb-8 text-base sm:text-lg px-5 text-justify text-gray-300 leading-relaxed">
                {" "}
                <span className=" ring-emerald-400/25 px-1.5 py-0.5">
                  {" "}
                  {file.description}{" "}
                </span>{" "}
              </p>{" "}
              {/* Redesigned button without input */}{" "}
              <div className="flex justify-center lg:justify-start">
                {" "}
                <button
                  onClick={() => {
                    const el = document.querySelector("#lead-form");
                    if (el)
                      el.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 px-8 py-4 font-semibold text-gray-900 shadow-lg hover:from-emerald-400 hover:to-emerald-500 transition-all"
                >
                  {" "}
                  <span className="absolute inset-0 bg-emerald-600 opacity-20 rounded-full"></span>{" "}
                  <span className="relative flex items-center gap-2 font-bold text-xl">
                    {" "}
                    Download <ArrowRight className="h-4 w-4" />{" "}
                  </span>{" "}
                </button>{" "}
              </div>{" "}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lead Form + Download Counter */}
      <motion.section
        className="mb-16 max-w-6xl mx-auto"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUpVariant}
      >
        <div
          className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
          id="lead-form"
        >
          <div className="lg:w-2/3 bg-white p-8">
            <LeadForm ebookId={file.id} downloadUrl={file.url} />
          </div>
          <div className="lg:w-1/3 bg-white p-8">
            <DownloadCounter />
          </div>
        </div>
      </motion.section>

      {/* Reviews */}
      <motion.section
        className="mb-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUpVariant}
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
