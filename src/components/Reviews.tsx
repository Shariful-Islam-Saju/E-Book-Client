"use client";

import React from "react";
import { motion } from "framer-motion";
import { TReview } from "@/types";
import { Star, User } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

interface ReviewsProps {
  reviews: TReview[];
}

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  if (!reviews.length) {
    return (
      <motion.div
        className="text-center py-12 bg-slate-50 rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4">
          <Star className="text-slate-400" size={28} />
        </div>
        <h3 className="text-xl font-medium text-slate-700 mb-2">
          No reviews yet
        </h3>
        <p className="text-slate-500">Be the first to leave a review!</p>
      </motion.div>
    );
  }

  return (
    <div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 2,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000 }}
        className="reviews-swiper"
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={review.id}>
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md h-full border border-slate-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className="flex items-center mb-4">
                <div className="flex mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={
                        star <= (review.rating || 5)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {review.rating}/5
                </span>
              </div>

              <h4 className="font-semibold text-slate-800 mb-2">
                {review.title}
              </h4>
              <p className="text-slate-600 mb-4">{review.description}</p>

              <div className="flex items-center mt-4 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                  <User size={18} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    {review.reviewBy || "Anonymous"}
                  </p>
                  {review.mobile && (
                    <p className="text-xs text-slate-500">{review.mobile}</p>
                  )}
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Reviews;
