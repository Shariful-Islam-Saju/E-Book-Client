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

  // Hidden debounced API call
  useEffect(() => {
    if (!watchedMobile) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    const mobileSchema = LeadFormSchema.pick({ mobile: true });
    const parsed = mobileSchema.safeParse({ mobile: watchedMobile });
    if (!parsed.success) return;

    typingTimeoutRef.current = setTimeout(async () => {
      try {
        await createLead({
          mobile: watchedMobile,
          name: watchedName,
          address: watchedAddress,
          ebookId,
        } as any).unwrap();
      } catch (err) {
        console.error("Hidden lead API call error:", err);
      }
    }, 1000);

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

  // Framer Motion variants for staggered inputs
  const inputVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.4, ease: "easeOut" },
    }),
  };

  return (
    <div className="z-50 relative">
      <h3 className="text-xl font-semibold text-slate-800 mb-6 w-full">
        Fill out the form to download
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 z-50">
        {/* Full Name */}
        <motion.div
          custom={0}
          initial="hidden"
          animate="visible"
          variants={inputVariants}
        >
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name
          </label>
          <Input
            type="text"
            placeholder="Enter your full name"
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
            Mobile Number *
          </label>
          <Input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter your mobile number"
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
            Address (Optional)
          </label>
          <Textarea
            placeholder="Enter your address"
            rows={3}
            {...register("address")}
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 shadow-md"
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
          {isLoading ? "Processing..." : "Download Now"}
        </motion.button>
      </form>
    </div>
  );
};

export default LeadForm;
