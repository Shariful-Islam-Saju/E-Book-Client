import React from "react";
import { motion } from "framer-motion";
import { BookX } from "lucide-react";
import RandomBox from "@/components/RandomBox";

const NoEBooks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <RandomBox />
      {/* Center Content */}
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-purple-200 shadow-lg"
        >
          <BookX size={64} className="mx-auto text-purple-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Books Found
          </h2>
          <p className="text-gray-600 mb-4">
            It looks like there are no e-books available right now.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-colors shadow-md"
            onClick={() => window.location.reload()}
          >
            Refresh
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default NoEBooks;
