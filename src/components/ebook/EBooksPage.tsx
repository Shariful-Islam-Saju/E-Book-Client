"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion, Variants, easeOut } from "framer-motion";
import { useGetSingleFileQuery } from "@/redux/features/file/fileApi";
import { TEBook } from "@/types";
import { ArrowDown } from "lucide-react";
import Reviews from "../Reviews";
import LeadForm from "../LeadForm";
import EbookPageSkeleton from "./EbookPageSkeleton";
import NoEbookFound from "./NoEbookFound";
import DownloadCounter from "./DownloadCounter";
import RandomBox from "../RandomBox";
import { Hind_Siliguri } from "next/font/google";
import { useTracking } from "@/components/TrackingProvider";
import Image from "next/image";

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "700"],
});

const EBooksPage: React.FC = () => {
  const MotionImage = motion.create(Image);
  const params = useParams();
  const [yOffset, setYOffset] = useState(100);
  const [showForm, setShowForm] = useState(false);
  const { trackEbookView } = useTracking();
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

  // Track ebook view when file data is loaded
  useEffect(() => {
    if (file && file.id && file.title) {
      trackEbookView(file.title, file.id);
    }
  }, [file, trackEbookView]);

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
  console.log(file);

  // Replace your button onClick handlers with this
  const handleDownloadClick = () => {
    if (!showForm) {
      setShowForm(true);
      setTimeout(() => {
        const el = document.querySelector("#lead-form");
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100); // wait for DOM update
    } else {
      const el = document.querySelector("#lead-form");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
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
                <MotionImage
                  src={file?.imgUrl || "/placeholder-ebook.png"}
                  alt={file?.title || "Ebook Image"}
                  width={400}
                  height={600}
                  className="relative z-10 w-full rounded-md"
                  style={{ boxShadow: "10px 8px 4px rgba(0,0,0,0.5)" }}
                  decoding="async"
                  loading="eager"
                  priority
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
              <h1 className="font-bold text-4xl/[1.15] px-5 md:px-0 sm:text-5xl/[1.1] text-white tracking-tight mb-5">
                {file.title}
              </h1>

              <p className="mb-6 text-base text-end sm:text-lg px-5 md:px-0 md:text-center text-gray-100 leading-relaxed">
                <span className="ring-emerald-400/25 py-0.5">
                  {file.description}
                </span>
              </p>

              {/* Price Section */}
              <div className="flex flex-col items-center lg:items-start mb-4">
                <p className="text-gray-200 text-base font-medium mb-2">
                  বিশেষ অফার মূল্য
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  {/* Original Price */}
                  <span className="text-gray-200 line-through text-lg">
                    ৳{file.bookPrice}
                  </span>
                  {/* Discounted Price */}
                  <span className="text-2xl font-extrabold text-emerald-400">
                    ৳{file.bookPrice - file.discount} টাকা

                  </span>
                </div>
              </div>

              {/* Button */}
              <div className="flex justify-center lg:justify-start">
                <button
                  onClick={handleDownloadClick}
                  className="relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-md px-4 py-2 bg-[rgb(37,177,112)] text-white transition-all"
                >
                  <span className="relative flex items-center gap-2 font-bold text-lg">
                    ডাউনলোড করুন <ArrowDown className="h-4 w-4" />
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
        <div className="bg-gradient-to-r z-50 rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          <div className="lg:w-2/3 bg-white p-8">
            <LeadForm
              ebookId={file.id}
              downloadUrl={file.url}
              ebookTitle={file.title}
            />
          </div>
          <div className="lg:w-1/3 bg-white p-8">
            <DownloadCounter />
          </div>
        </div>
      </motion.section>

      <motion.section
        className={`mb-16 max-w-6xl mx-auto z-50 mt-20 lg:mt-32 ${
          showForm ? "hidden" : "block"
        }`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUpVariant}
      >
        <div className="z-50  rounded-2xl  overflow-hidden flex justify-center">
          <DownloadCounter />
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
        <div className="flex justify-center ">
          <button
            onClick={handleDownloadClick}
            className="relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-md px-4 py-2 bg-[rgb(37,177,112)] text-white transition-all"
          >
            <span className="relative flex items-center gap-2 font-bold text-lg">
              ডাউনলোড করুন <ArrowDown className="h-4 w-4" />
            </span>
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-gray-600"
        >
          <p>© {new Date().getFullYear()} Digital Seba. All rights reserved.</p>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default EBooksPage;
