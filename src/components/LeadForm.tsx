"use client";

import { useEffect, useRef } from "react";
import { useCreateLeadMutation } from "@/redux/features/lead/leadApi";
import { DownloadCloud } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { LeadFormSchema } from "@/schemas/LeadFormSchema";

type LeadFormInputs = z.infer<typeof LeadFormSchema>;

interface LeadFormProps {
  ebookId: string;
  downloadUrl?: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ ebookId, downloadUrl }) => {
  const [createLead, { isLoading }] = useCreateLeadMutation();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LeadFormInputs>({
    resolver: zodResolver(LeadFormSchema),
  });

  const watchedMobile = watch("mobile");
  const watchedName = watch("name");
  const watchedAddress = watch("address");

  // Hidden debounced API call for mobile (+ name + address)
  useEffect(() => {
    if (!watchedMobile) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    // Validate mobile number using Zod
    const mobileSchema = LeadFormSchema.pick({ mobile: true });
    const parsed = mobileSchema.safeParse({ mobile: watchedMobile });
    if (!parsed.success) return; // invalid mobile → skip API call

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        await createLead({
          mobile: watchedMobile,
          name: watchedName,
          address: watchedAddress,
          ebookId,
        } as any).unwrap();

        console.log("Auto-saved lead (valid mobile):", {
          mobile: watchedMobile,
          name: watchedName,
          address: watchedAddress,
        });
      } catch (err) {
        console.error("Hidden lead API call error:", err);
      }
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [watchedMobile, watchedName, watchedAddress, ebookId, createLead]);

  const onSubmit = async (data: LeadFormInputs) => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    try {
      await createLead({ ...data, ebookId }).unwrap();

      toast.success("Success! Your download will start shortly.");

      if (downloadUrl) {
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = downloadUrl.split("/").pop() || "file.pdf";
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error("Download URL not available.");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || "Something went wrong");
      console.error(err);
    }
  };

  return (
    <div className="z-50 relative">
      <h3 className="text-xl font-semibold text-slate-800 mb-6 w-full">
        Fill out the form to download
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4  z-50">
        {/* Full Name */}
        <div >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            {...register("name")}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Mobile */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Mobile Number *
          </label>
          <input
            type="text"
            placeholder="Enter your mobile number"
            {...register("mobile")}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {errors.mobile && (
            <p className="text-sm text-red-500 mt-1">{errors.mobile.message}</p>
          )}
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Address (Optional)
          </label>
          <textarea
            placeholder="Enter your address"
            {...register("address")}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Submit Button */}
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
    </div>
  );
};

export default LeadForm;
