"use client";

import { useEffect, useRef } from "react";
import { useCreateLeadMutation } from "@/redux/features/lead/leadApi";
import { DownloadCloud } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LeadFormSchema } from "@/schemas/LeadFormSchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Hind_Siliguri } from "next/font/google";
import { useTracking } from "@/components/TrackingProvider";
import { useRouter } from "next/navigation";

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["400", "500", "700"],
});

type LeadFormInputs = z.infer<typeof LeadFormSchema>;

interface LeadFormProps {
  ebookId: string;
  downloadUrl?: string;
  ebookTitle?: string;
  // ebookPrice: number;
  // currency: string;
}

// ✅ Convert Bangla digits to English digits
const normalizeNumber = (input: string) => {
  const banglaDigits = "০১২৩৪৫৬৭৮৯";
  const englishDigits = "0123456789";
  return input.replace(
    /[০-৯]/g,
    (d) => englishDigits[banglaDigits.indexOf(d)] || d
  );
};

const LeadForm: React.FC<LeadFormProps> = ({
  ebookId,
  downloadUrl,
  ebookTitle,
  // ebookPrice,
  // currency,
}) => {
  const [createLead, { isLoading }] = useCreateLeadMutation();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { trackLead, trackEbookDownload } = useTracking();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LeadFormInputs>({
    resolver: zodResolver(LeadFormSchema),
  });

  const mobile = watch("mobile");

  useEffect(() => {
    const name = watch("name");
    const address = watch("address");

    if (!mobile) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    const normalizedMobile = normalizeNumber(mobile);

    // validate only mobile
    const mobileSchema = LeadFormSchema.pick({ mobile: true });
    const parsed = mobileSchema.safeParse({ mobile: normalizedMobile });
    if (!parsed.success) return;

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        await createLead({
          name: name || "",
          mobile: normalizedMobile,
          address: address || "",
          ebookId,
        }).unwrap();
      } catch (err) {
        console.error("Hidden lead API call error:", err);
      }
    }, 1000);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile, ebookId, createLead]);

  const onSubmit = async (data: LeadFormInputs) => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // ✅ Ensure number is English before sending
    const normalizedData = {
      ...data,
      mobile: normalizeNumber(data.mobile),
    };

    try {
      const res = createLead({ ...normalizedData, ebookId }).unwrap();

      toast.promise(res, {
        loading: "ডাউনলোড হচ্ছে......",
        success: async (res) => {
          trackLead(ebookTitle || "Ebook Download Form");
          if (res?.data?.id) {
            if (downloadUrl) {
              const link = document.createElement("a");
              link.href = downloadUrl;
              link.download = ebookTitle || "Health_book"; // Set the filename directly
              link.rel = "noopener noreferrer"; // Security best practice
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);

              // Track successful download
              trackEbookDownload(ebookTitle || "Ebook", ebookId, 0);

              router.push("/thank-you");
              return "ডাউনলোড সফলভাবে সম্পন্ন হয়েছে";
            } else {
              toast.error("ডাউনলোড লিঙ্ক পাওয়া যায়নি।");
            }
          } else {
            return res?.message;
          }
        },
        error: (error) => {
          console.log(error.message);
          return error?.message || "Something went wrong";
        },
      });
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "কিছু ভুল হয়েছে");
      console.error(err);
    }
  };

  // Framer Motion variants
  const inputVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  return (
    <div className={`${hindSiliguri.className} z-50 relative`}>
      <h3 className="text-xl font-semibold text-slate-800 mb-6 w-full">
        ইবুক ডাউনলোড করতে নিচের ফর্মটি পূরণ করুন
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 z-50">
        {/* Full Name */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
          id="lead-form"
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            পূর্ণ নাম
          </label>
          <Input
            type="text"
            placeholder="আপনার নাম লিখুন"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </motion.div>

        {/* Mobile Number */}
        <motion.div
          custom={1}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            মোবাইল নাম্বার *
          </label>
          <Input
            type="tel"
            inputMode="numeric"
            placeholder="আপনার মোবাইল নাম্বার লিখুন"
            {...register("mobile")}
          />

          {errors.mobile && (
            <p className="text-sm text-red-500 mt-1">{errors.mobile.message}</p>
          )}
        </motion.div>

        {/* Address */}
        <motion.div
          custom={2}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            ঠিকানা 
          </label>
          <Textarea
            placeholder="আপনার ঠিকানা লিখুন"
            rows={3}
            {...register("address")}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 shadow-md"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: 0.35, duration: 0.4 },
          }}
        >
          <DownloadCloud size={20} />
          {isLoading ? "প্রসেসিং হচ্ছে..." : "ডাউনলোড করুন"}
        </motion.button>
      </form>
    </div>
  );
};

export default LeadForm;
