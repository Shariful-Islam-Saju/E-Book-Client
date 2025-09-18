"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import React, { useEffect, useRef } from "react";

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

    const speed = 0.5; // pixels per frame, adjust as needed
    let translateX = 0;

    const cloneItems = () => {
      const children = Array.from(container.children) as HTMLElement[];
      children.forEach((child) => {
        const clone = child.cloneNode(true) as HTMLElement;
        container.appendChild(clone);
      });
    };

    cloneItems(); // duplicate items initially

    const animate = () => {
      translateX -= speed;
      const firstChild = container.children[0] as HTMLElement;

      if (firstChild) {
        const firstChildWidth = firstChild.offsetWidth + 24; // card width + gap
        if (Math.abs(translateX) >= firstChildWidth) {
          // move first child to end
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
      <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-slate-100">
          <Star className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600">No Reviews Yet</h3>
        <p className="mt-2 text-sm text-slate-500">
          Be the first to share your thoughts about this ebook.
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden py-12">
      {/* Gradients */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-16 sm:w-20 bg-gradient-to-r from-white to-transparent z-20" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-16 sm:w-20 bg-gradient-to-l from-white to-transparent z-20" />

      <div
        ref={containerRef}
        className="flex gap-6 whitespace-nowrap will-change-transform"
      >
        {reviews.map((review, idx) => (
          <Card
            key={idx}
            className="flex-shrink-0 shadow-md border border-slate-200 bg-white/80 backdrop-blur-sm
                       min-w-[260px] max-w-[280px] md:min-w-[340px] md:max-w-[360px]"
          >
            <CardContent className="p-6">
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
              <h3 className="text-lg font-semibold text-slate-800">
                {review.title}
              </h3>
              <p className="mt-2 text-slate-600 text-sm line-clamp-3">
                {review.description}
              </p>
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
      </div>
    </div>
  );
};

export default Reviews;
