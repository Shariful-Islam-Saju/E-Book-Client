import { useCreateLeadMutation } from "@/redux/features/lead/leadApi";
import { TLead } from "@/types";
import { AlertCircle, CheckCircle, DownloadCloud } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

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
      <h3 className="text-xl font-semibold text-slate-800 mb-6 w-full">
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


export default LeadForm;
