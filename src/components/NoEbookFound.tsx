"use client";

import { motion } from "framer-motion";
import { BookOpen, Search } from "lucide-react";

const NoEbookFound: React.FC = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Icon with subtle bounce */}
      <motion.div
        className="w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center bg-blue-100 rounded-full mb-6"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <BookOpen className="w-12 h-12 sm:w-14 sm:h-14 text-blue-600" />
      </motion.div>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
        No Ebooks Found
      </h2>

      {/* Subtitle */}
      <p className="text-sm sm:text-base text-slate-500 mb-6 max-w-md">
        Sorry, we couldn’t find any ebooks that match your search. Try adjusting
        your filters or check back later for new ebooks.
      </p>

      {/* Call-to-action button */}
      <motion.a
        href="/ebooks" // link to main ebooks page or refresh
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Browse All Ebooks
        <Search className="ml-2 w-5 h-5" />
      </motion.a>
    </motion.div>
  );
};

export default NoEbookFound;
