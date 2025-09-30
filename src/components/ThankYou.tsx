"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import RandomBox from "./RandomBox";
import { Hind_Siliguri } from "next/font/google";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTracking } from "./TrackingProvider";

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ThankYou = () => {
  const searchParams = useSearchParams();
  const { trackEbookDownload } = useTracking();
  const hasTracked = useRef(false); // Prevent double-firing in development mode

  // Extract ebook data from URL parameters
  const ebookId = searchParams.get("id");
  const ebookTitle = searchParams.get("title");
  const ebookPrice = searchParams.get("price");
  const currency = searchParams.get("currency") || "BDT";

  console.log("📊 Thank You Page - Ebook Data:", {
    ebookId,
    ebookTitle,
    ebookPrice,
    currency,
  });

  // Track purchase event when component mounts
  useEffect(() => {
    // Prevent double-firing (especially in React StrictMode/development)
    if (hasTracked.current) {
      console.log("⚠️ Purchase event already tracked, skipping...");
      return;
    }

    if (ebookId && ebookTitle && ebookPrice) {
      const price = parseFloat(ebookPrice);
      if (!isNaN(price)) {
        console.log("✅ Firing Purchase event with params:", {
          ebookId,
          ebookTitle,
          price,
          currency,
        });
        trackEbookDownload(ebookTitle, ebookId, price, currency);
        hasTracked.current = true;
      } else {
        console.error("❌ Invalid price value:", ebookPrice);
      }
    } else {
      console.warn("⚠️ Missing required parameters for Purchase event:", {
        ebookId: !!ebookId,
        ebookTitle: !!ebookTitle,
        ebookPrice: !!ebookPrice,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only fire once on mount

  return (
    <div
      className={`${hindSiliguri.className} relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4`}
    >
      {/* Background elements */}
      <RandomBox />

      {/* Nature elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-green-800/20 z-0"></div>
      <div className="absolute top-10 left-10 w-16 h-16 bg-green-400/30 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 right-12 w-20 h-20 bg-emerald-400/30 rounded-full blur-xl"></div>

      {/* Floating leaves */}
      <div className="absolute top-20 right-1/4 animate-float">
        <svg
          className="w-10 h-10 text-green-600/40"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C12 2 16 6 16 12 16 15 14 16 12 16 10 16 8 15 8 12 8 6 12 2 12 2Z" />
        </svg>
      </div>
      <div
        className="absolute top-1/3 left-1/4 animate-float"
        style={{ animationDelay: "2s" }}
      >
        <svg
          className="w-8 h-8 text-emerald-600/40"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C12 2 16 6 16 12 16 15 14 16 12 16 10 16 8 15 8 12 8 6 12 2 12 2Z" />
        </svg>
      </div>
      <div
        className="absolute bottom-1/4 right-1/3 animate-float"
        style={{ animationDelay: "4s" }}
      >
        <svg
          className="w-12 h-12 text-green-700/30"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C12 2 16 6 16 12 16 15 14 16 12 16 10 16 8 15 8 12 8 6 12 2 12 2Z" />
        </svg>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-6 md:p-10 max-w-2xl w-full"
      >
        {/* Decorative elements */}
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-green-500/20 rounded-full blur-lg"></div>
        <div className="absolute -bottom-2 -left-2 w-20 h-20 bg-emerald-500/20 rounded-full blur-lg"></div>

        {/* Content container */}
        <div className="text-center">
          {/* Checkmark icon with leaf design */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex items-center justify-center w-24 h-24 bg-green-100 rounded-full border border-green-300/50"
          >
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold mb-4 text-green-800"
          >
            ধন্যবাদ!
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-xl md:text-2xl font-semibold mb-6 text-emerald-700"
          >
            {ebookTitle
              ? `"${ebookTitle}" সফলভাবে ডাউনলোড হয়েছে`
              : "আপনার ইবুক সফলভাবে ডাউনলোড হয়েছে"}
          </motion.p>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-lg mb-8 text-gray-700 leading-relaxed text-justify"
          >
            <p className="mb-4">
              &quot;প্রাকৃতিক স্বাস্থ্য কেয়ার গাইডবুক&quot; ডাউনলোড করার জন্য
              আপনাকে ধন্যবাদ। প্রাকৃতিক উপায়ে সুস্থ থাকার সকল টিপস এবং গাইডলাইন
              এই বইটিতে পাবেন।
            </p>
            <p>
              স্বাস্থ্যকর জীবনযাপন সম্পর্কে আরও তথ্য পেতে আমাদের ফেসবুক পেজে যোগ
              দিন এবং নিয়মিত স্বাস্থ্য টিপস পান।
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
          >
            {/* Phone call button */}
            <Link
              href="tel:+88019611900247"
              className="px-6 py-3  bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-green-500/30 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              ফোন করুন
            </Link>

            {/* Facebook button */}
            <Link
              href="https://www.facebook.com/share/16ycS2sZNv/"
              target="_blank"
              className="px-6 cursor-pointer py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-blue-500/30 flex items-center justify-center"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              ফেসবুক পেজ
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 w-full text-center text-sm text-green-700/70 z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-gray-600"
        >
          <p>© {new Date().getFullYear()} Digital Seba. All rights reserved.</p>
        </motion.div>{" "}
      </div>

      {/* Add the floating animation style */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(5deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ThankYou;
