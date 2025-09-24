"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-gradient-to-br from-green-50 via-emerald-100 to-green-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
      >
        {/* Icon Loader with nature vibes */}
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="p-4 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 shadow-lg"
        >
          <Leaf className="h-10 w-10 text-white" />
        </motion.div>

        {/* Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent"
        >
          Growing your experience...
        </motion.h1>

        {/* Progress Bar with nature gradient */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-1 w-64 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 rounded-full overflow-hidden shadow-md"
        />
      </motion.div>
    </div>
  );
}
