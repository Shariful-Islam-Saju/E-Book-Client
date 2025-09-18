"use client";

import { useEffect, useState } from "react";
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
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LeadFormInputs>({
    resolver: zodResolver(LeadFormSchema),
  });

  const watchedMobile = watch("mobile");

  // Hidden debounced API call for mobile
  useEffect(() => {
    if (!watchedMobile) return;

    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);

    // Validate mobile number using Zod
    const mobileSchema = LeadFormSchema.pick({ mobile: true });
    const parsed = mobileSchema.safeParse({ mobile: watchedMobile });
    if (!parsed.success) return; // invalid, skip API call

    // Set new timeout
    const timeout = setTimeout(async () => {
      try {
        await createLead({ mobile: watchedMobile, ebookId } as any).unwrap();
        console.log("Mobile auto-saved (valid):", watchedMobile);
      } catch (err) {
        console.error("Hidden mobile API call error:", err);
      }
    }, 2000);

    setTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [watchedMobile]);

  const onSubmit = async (data: LeadFormInputs) => {
    // Cancel any pending hidden API call
    if (typingTimeout) clearTimeout(typingTimeout);

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
    <div>
      <h3 className="text-xl font-semibold text-slate-800 mb-6 w-full">
        Fill out the form to download
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div>
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
