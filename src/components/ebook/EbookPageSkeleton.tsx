import { motion, Variants, Easing } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as Easing, // ✅ cubic-bezier easing
    },
  },
};

function EBookSkeleton() {
  return (
    <section className="z-50 min-h-screen flex items-center justify-center isolate bg-[rgb(58,126,173)] px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl w-full py-10 sm:py-14 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Image Skeleton */}
          <motion.div
            className="order-1 lg:order-1 flex justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
          >
            <div className="relative w-[80%] max-w-sm sm:max-w-md">
              <div className="relative z-10 w-full rounded-md bg-gray-300/20">
                <Skeleton
                  className="w-full aspect-[3/4] rounded-md"
                  style={{ boxShadow: "10px 8px 4px rgba(0,0,0,0.5)" }}
                />
              </div>
            </div>
          </motion.div>

          {/* Title + Description + Button Skeleton */}
          <motion.div
            className="order-2 lg:order-2 text-center lg:text-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUpVariant}
          >
            {/* Title Skeleton */}
            <div className="px-2 sm:px-0 mb-5">
              <Skeleton className="h-10 w-4/5 mx-auto lg:mx-0 bg-white/30 rounded-lg" />
              <Skeleton className="h-10 w-2/3 mx-auto lg:mx-0 bg-white/30 rounded-lg mt-2" />
            </div>

            {/* Description Skeleton */}
            <div className="mb-6 px-2 sm:px-0">
              <Skeleton className="h-4 w-full bg-white/20 rounded mb-2" />
              <Skeleton className="h-4 w-5/6 mx-auto lg:mx-0 bg-white/20 rounded mb-2" />
              <Skeleton className="h-4 w-4/6 mx-auto lg:mx-0 bg-white/20 rounded mb-2" />
              <Skeleton className="h-4 w-3/6 mx-auto lg:mx-0 bg-white/20 rounded" />
            </div>

            {/* Price Section Skeleton */}
            <div className="flex flex-col items-center lg:items-start mb-6">
              <Skeleton className="h-5 w-32 bg-white/20 rounded mb-2" />
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Original Price Skeleton */}
                <Skeleton className="h-6 w-16 bg-white/20 rounded" />
                {/* Discounted Price Skeleton */}
              </div>
            </div>


          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default EBookSkeleton;
