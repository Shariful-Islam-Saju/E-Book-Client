"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Hind_Siliguri } from "next/font/google";
import { TReview } from "@/types";

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "700"],
});

type ReviewsProps = {
  reviews: TReview[];
};

const Reviews = ({ reviews }: ReviewsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 4) return phone;
    const first = phone.slice(0, 3);
    const last = phone.slice(-2);
    return `${first}******${last}`;
  };

  useEffect(() => {
    if (!containerRef.current || reviews.length === 0) return;

    const container = containerRef.current;
    let animationFrameId: number;

    const speed = 0.5;
    let translateX = 0;

    const cloneItems = () => {
      const children = Array.from(container.children) as HTMLElement[];
      children.forEach((child) => {
        const clone = child.cloneNode(true) as HTMLElement;
        container.appendChild(clone);
      });
    };

    cloneItems();

    const animate = () => {
      translateX -= speed;
      const firstChild = container.children[0] as HTMLElement;

      if (firstChild) {
        const firstChildWidth = firstChild.offsetWidth + 24;
        if (Math.abs(translateX) >= firstChildWidth) {
          container.appendChild(firstChild);
          translateX += firstChildWidth;
        }
      }

      container.style.transform = `translateX(${translateX}px)`;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [reviews]);

  if (!reviews || reviews.length === 0) {
    return (
      <div
        className={`${hindSiliguri.className} text-center py-12 rounded-2xl border border-slate-200`}
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-100">
          <Star className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600">কোনো রিভিউ নেই</h3>
        <p className="mt-2 text-sm text-slate-500">
          এই ইবুক নিয়ে আপনার মতামত শেয়ার করুন প্রথমে।
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full z-30 overflow-hidden py-12">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-20 bg-gradient-to-r from-white to-transparent z-20" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-20 bg-gradient-to-l from-white to-transparent z-20" />

      <div ref={containerRef} className="flex gap-6 will-change-transform">
        {reviews.map((review, idx) => (
          <Card
            key={idx}
            className="flex shadow-md border border-slate-200 bg-white/80 backdrop-blur-sm
                 min-w-[260px] max-w-[280px] md:min-w-[340px] md:max-w-[360px]"
          >
            <CardContent className="p-6 flex flex-col justify-between h-full">
              <div>
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
                <h3
                  className={`${hindSiliguri.className} text-lg font-semibold text-slate-800`}
                >
                  {review.title}
                </h3>
                <p
                  className={`${hindSiliguri.className} mt-2 text-slate-600 text-sm break-words`}
                >
                  {review.description}
                </p>
              </div>

              {/* Review info sticks to bottom */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                {/* Reviewer Avatar */}
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-200 text-slate-800 font-medium text-sm overflow-hidden">
                  {review.profileImg ? (
                    <img
                      src={review.profileImg}
                      alt={review.reviewBy}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{review.reviewBy.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Reviewer Info */}
                <div>
                  <p
                    className={`${hindSiliguri.className} text-sm font-medium text-slate-800`}
                  >
                    {review.reviewBy}
                  </p>
                  {review.mobile && (
                    <p
                      className={`${hindSiliguri.className} text-xs text-slate-500`}
                    >
                      {maskPhone(review.mobile)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
