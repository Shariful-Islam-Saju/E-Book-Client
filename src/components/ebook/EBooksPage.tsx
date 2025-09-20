"use client";

import React, { useEffect, useState } from "react";
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
import RandomBox from "../RandomBox";
import { Hind_Siliguri } from "next/font/google";

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "700"],
});

const EBooksPage: React.FC = () => {
  const params = useParams();
  const [yOffset, setYOffset] = useState(100);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const updateYOffset = () => {
      const width = window.innerWidth;
      if (width <= 1024) {
        setYOffset(0);
      } else if (width >= 1024) {
        setYOffset(90);
      }
    };

    updateYOffset();
    window.addEventListener("resize", updateYOffset);
    return () => window.removeEventListener("resize", updateYOffset);
  }, [yOffset, setYOffset]);

  // ✅ Scroll into view after form becomes visible
  useEffect(() => {
    if (showForm) {
      const el = document.querySelector("#lead-form");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 50); // small delay ensures DOM is updated
      }
    }
  }, [showForm]);

  let id = params?.id;
  if (Array.isArray(id)) id = id[0];

  const { data: rawFile, isLoading, isError } = useGetSingleFileQuery(id ?? "");
  const file: TEBook | null = rawFile?.data ?? null;

  if (!id)
    return (
      <div
        className={`${hindSiliguri.className} min-h-screen flex items-center justify-center`}
      >
        কোনো ফাইল আইডি দেওয়া হয়নি।
      </div>
    );
  if (isLoading) return <EbookPageSkeleton />;
  if (isError || !file) return <NoEbookFound />;

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
    <div
      className={`${hindSiliguri.className} min-h-screen relative bg-gradient-to-b from-slate-50 to-slate-100`}
    >
      <RandomBox />
      {/* Hero Section */}
      <section className=" z-50 md:lg:mb-24 pb-5 isolate  bg-[rgb(58,126,173)]">
        <div className="mx-auto max-w-6xl pt-8">
          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-16">
            {/* Image */}
            <motion.div
              className="order-1 lg:order-1 my-6 md:my-0"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeUpVariant}
            >
              <div className="relative mx-auto w-[70%] max-w-md">
                <motion.img
                  src={file?.imgUrl || "/placeholder-ebook.png"}
                  alt={file.title}
                  className="relative z-10 w-full rounded-md "
                  style={{ boxShadow: "10px 8px 4px rgba(0,0,0,0.5)" }}
                  decoding="async"
                  loading="eager"
                  initial={{ opacity: 0, scale: 0.9, y: yOffset }}
                  animate={{ opacity: 1, scale: 1, y: yOffset }}
                  transition={{ duration: 0.8, ease: easeOut }}
                />
              </div>
            </motion.div>

            {/* Title + Description + Button */}
            <motion.div
              className="order-2 lg:order-2 text-center lg:text-left"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              variants={fadeUpVariant}
            >
              <h1 className="font-bold text-4xl/[1.15] px-5 md:px-0 sm:text-5xl/[1.1] text-gray-100 tracking-tight mb-5">
                {file.title}
              </h1>
              <p className="mb-8  text-base text-center lg:text-start sm:text-lg px-5 md:px-0  text-gray-300 leading-relaxed">
                <span className=" ring-emerald-400/25  py-0.5">
                  {file.description}
                </span>
              </p>
              {/* Button */}
              <div className="flex justify-center lg:justify-start">
                <button
                  onClick={() => setShowForm(true)}
                  className="relative inline-flex items-center justify-center overflow-hidden rounded-md px-4 py-2 bg-[rgb(37,177,112)] text-white transition-all"
                >
                  <span className="relative flex items-center gap-2 font-bold text-lg">
                    ডাউনলোড করুন <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Form + Download Counter */}
      <motion.section
        className={`mb-16 max-w-6xl mx-auto z-50 mt-14 ${
          showForm ? "block" : "hidden"
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUpVariant}
      >
        <div
          className="bg-gradient-to-r z-50 from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row"
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
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUpVariant}
        className="z-30 relative mt-10"
      >
        <h2 className="text-3xl font-bold text-center px-5 text-slate-800 mb-4">
          পাঠকদের অভিমত
        </h2>
        <p className="text-center text-slate-600 mb-12 px-5 max-w-2xl mx-auto">
          জেনে নিন কেন হাজারো পাঠক এই ইবুককে তাদের প্রিয় রিসোর্স হিসেবে বেছে
          নিয়েছে।
        </p>
        <Reviews reviews={file.reviews ?? []} />
      </motion.section>
    </div>
  );
};

export default EBooksPage;
