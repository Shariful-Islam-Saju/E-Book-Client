"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import React from "react";

type Review = {
  title: string;
  rating: number;
  description: string;
  reviewBy: string;
  mobile?: string;
};

type ReviewsProps = {
  reviews: Review[];
};

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  const maskPhone = (phone: string) => {
    if (phone.length < 4) return phone; // fallback for short numbers
    const first = phone.slice(0, 3); // first 3 digits
    const last = phone.slice(-2); // last 2 digits
    return `${first}******${last}`;
  };
  if (!reviews || reviews.length === 0) {
    return (
      <motion.div
        className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-100">
          <Star className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600">No Reviews Yet</h3>
        <p className="mt-2 text-sm text-slate-500">
          Be the first to share your thoughts about this ebook.
        </p>
      </motion.div>
    );
  }

  // Duplicate reviews for seamless loop
  const loopedReviews = [...reviews, ...reviews];

  // Adjust animation speed for responsiveness
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const animationDuration = isMobile ? 15 : 25; // faster on mobile

  return (
    <div className="relative w-full overflow-hidden py-12">
      {/* Left Gradient */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-20 bg-gradient-to-r from-white to-transparent z-20" />

      {/* Right Gradient */}
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-20 bg-gradient-to-l from-white to-transparent z-20" />

      {/* Motion Container */}
      <motion.div
        className="flex gap-6"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          ease: "linear",
          duration: animationDuration,
          repeat: Infinity,
        }}
      >
        {loopedReviews.map((review, idx) => (
          <Card
            key={idx}
            className="flex-shrink-0 shadow-md border border-slate-200 bg-white/80 backdrop-blur-sm
                       min-w-[65%] max-w-[70%] sm:min-w-[260px] sm:max-w-[280px] md:min-w-[340px] md:max-w-[360px]"
          >
            <CardContent className="p-6">
              {/* Rating Stars */}
              <div className="flex items-center mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              {/* Review Title */}
              <h3 className="text-lg font-semibold text-slate-800">
                {review.title}
              </h3>

              {/* Review Description */}
              <p className="mt-2 text-slate-600 text-sm line-clamp-3">
                {review.description}
              </p>

              {/* Reviewer Info */}
              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-sm font-medium text-slate-800">
                  {review.reviewBy}
                </p>
                {review.mobile && (
                  <p className="text-xs text-slate-500">
                    {maskPhone(review.mobile)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
  );
};

export default Reviews;
