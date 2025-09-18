"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  useGetSingleFileQuery,

} from "@/redux/features/file/fileApi";
import { TLead, TEBook, TReview } from "@/types";
import {
  Star,
  Eye,
  Users,
  ArrowRight,
  CheckCircle,
  DownloadCloud,
  AlertCircle,
  User,
  BookOpen,
  Clock,
  Award,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useCreateLeadMutation } from "@/redux/features/lead/leadApi";

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
  if (isError || !file)
    return (
      <div className="min-h-screen flex items-center justify-center">
        No file found.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row gap-8 items-center mb-16">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-slate-100"
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
                  <span className="ml-2 text-slate-700 font-medium">4.8</span>
                </div>
                <div className="flex items-center text-slate-500">
                  <Eye size={18} className="mr-1" />
                  <DownloadCounter ebookId={file.id} />
                </div>
                <div className="flex items-center text-slate-500">
                  <BookOpen size={18} className="mr-1" />
                  <span>{Math.floor(Math.random() * 100) + 150} pages</span>
                </div>
              </div>

              <motion.a
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center px-5 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Preview PDF
                <ArrowRight size={18} className="ml-2" />
              </motion.a>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full max-w-md">
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
        </section>



        {/* Download Form Section */}
        <motion.section
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-2/5 p-8 flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Get Your Free Copy Now
                </h2>
                <p className="text-blue-100 mb-6">
                  Join thousands of readers who have already downloaded this
                  ebook and transformed their skills.
                </p>
                <div className="flex items-center text-white mb-4">
                  <Users size={20} className="mr-2" />
                  <span className="font-medium">
                    1,200+ downloads this week
                  </span>
                </div>
                <ul className="space-y-2 text-blue-100">
                  <li className="flex items-center">
                    <CheckCircle size={18} className="mr-2 text-green-300" />
                    Instant download after submission
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={18} className="mr-2 text-green-300" />
                    No spam, we promise
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={18} className="mr-2 text-green-300" />
                    Premium content at no cost
                  </li>
                </ul>
              </div>
              <div className="lg:w-3/5 bg-white p-8">
                <LeadForm ebookId={file.id} downloadUrl={file.url} />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Reviews Section */}
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
    </div>
  );
};

// Lead Form Component
interface LeadFormProps {
  ebookId: string;
  downloadUrl?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ ebookId, downloadUrl }) => {
  const [lead, setLead] = useState<TLead>({
    name: "",
    mobile: "",
    address: "",
    ebookId,
  });
  const [createLead, { isLoading }] = useCreateLeadMutation();
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      await createLead({ ...lead, ebookId }).unwrap();
      setMessage({
        text: "Success! Your download will start shortly.",
        type: "success",
      });
      if (downloadUrl) {
        setTimeout(() => {
          window.open(downloadUrl, "_blank");
        }, 1500);
      } else {
        setMessage({ text: "Download URL not available.", type: "error" });
      }
    } catch (err: any) {
      setMessage({
        text: err?.data?.message || err?.message || "Something went wrong",
        type: "error",
      });
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold text-slate-800 mb-6">
        Fill out the form to download
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name *
          </label>
          <input
            name="name"
            value={lead.name}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mobile Number *
          </label>
          <input
            name="mobile"
            value={lead.mobile}
            onChange={onChange}
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter your mobile number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Address (Optional)
          </label>
          <textarea
            name="address"
            value={lead.address}
            onChange={onChange}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Enter your address"
          />
        </div>
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <DownloadCloud size={20} />
          {isLoading ? "Processing..." : "Download Now"}
        </motion.button>
      </form>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={20} className="mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          )}
          <p className="text-sm">{message.text}</p>
        </motion.div>
      )}
    </div>
  );
};

// Reviews Component
interface ReviewsProps {
  reviews: TReview[];
}

const Reviews: React.FC<ReviewsProps> = ({ reviews }) => {
  if (!reviews.length) {
    return (
      <motion.div
        className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200"
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
    <div className="px-2">
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
        className="pb-12"
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
              <p className="text-slate-600 mb-4 text-sm">
                {review.description}
              </p>

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

// Download Counter Component
const DownloadCounter: React.FC<{ ebookId: string }> = ({ ebookId }) => {
  // This would typically come from an API
  const [downloadCount] = useState(Math.floor(Math.random() * 10000) + 1000);

  return <span>{downloadCount.toLocaleString()} downloads</span>;
};

// Skeleton Loader
const EbookPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 items-center mb-16">
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
              <div className="h-6 w-24 bg-slate-200 rounded-full mb-4"></div>
              <div className="h-12 bg-slate-200 rounded mb-4"></div>
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-6"></div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <div className="h-5 w-20 bg-slate-200 rounded"></div>
                </div>
                <div className="h-5 w-32 bg-slate-200 rounded"></div>
              </div>

              <div className="h-12 w-40 bg-slate-200 rounded-lg"></div>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-blue-200 rounded-2xl transform rotate-3"></div>
              <div className="absolute inset-0 bg-blue-100 rounded-2xl transform -rotate-3"></div>
              <div className="relative rounded-2xl shadow-2xl w-full h-80 bg-slate-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EBooksPage;
