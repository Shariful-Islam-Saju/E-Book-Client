import React from 'react'
import { motion,  } from "framer-motion";
import { BookX } from 'lucide-react';

const NoEBooks = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              background: `linear-gradient(45deg, ${
                i % 3 === 0 ? "#ff9a9e" : i % 3 === 1 ? "#a1c4fd" : "#c2e9fb"
              })`,
            }}
            animate={{
              y: [0, Math.random() * 20 - 10, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1 + Math.random() * 0.2, 1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-red-200 shadow-lg"
        >
          <BookX size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Failed to load e-books
          </h2>
          <p className="text-gray-600 mb-4">Please try again later.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-md"
            onClick={() => window.location.reload()}
          >
            Retry
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}

export default NoEBooks