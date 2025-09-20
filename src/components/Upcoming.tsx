"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Wrench,
  Clock,
  Hammer,
  Sparkles,
  Construction,
} from "lucide-react";

export default function UnderConstruction() {
  const [dots, setDots] = useState("");
  const [bubbles, setBubbles] = useState<
    { w: number; h: number; top: string; left: string }[]
  >([]);
  const [tools, setTools] = useState<
    { top: string; left: string; emoji: string }[]
  >([]);

  useEffect(() => {
    // Animate "..."
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + "." : ""));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Generate bubbles once (client-side only)
    const generatedBubbles = Array.from({ length: 15 }).map(() => ({
      w: Math.floor(Math.random() * 40) + 10,
      h: Math.floor(Math.random() * 40) + 10,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }));
    setBubbles(generatedBubbles);

    // Generate floating tools once
    const toolEmojis = ["🔨", "🛠️", "📐", "⚡", "✨"];
    const generatedTools = toolEmojis.map((emoji) => ({
      emoji,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }));
    setTools(generatedTools);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {bubbles.map((bubble, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-yellow-500/20"
            style={{
              width: bubble.w,
              height: bubble.h,
              top: bubble.top,
              left: bubble.left,
            }}
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        {/* Central Construction Icon */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-yellow-500/20 rounded-full blur-xl"
            ></motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="relative bg-slate-800 p-6 rounded-full border-4 border-yellow-500 shadow-lg"
            >
              <Construction className="h-16 w-16 text-yellow-500 mx-auto" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Page Under Construction
        </motion.h1>

        <motion.p
          className="text-xl text-slate-300 mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          We&lsquo;re working hard to bring you something amazing!
        </motion.p>

        {/* Status Section */}
        <motion.div
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mb-6">
            <motion.div
              className="flex flex-col md:flex-row items-center text-center md:text-left"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-yellow-500/10 p-3 rounded-full mb-2 md:mb-0 md:mr-3">
                <Wrench className="h-6 w-6 text-yellow-500" />
              </div>
              <span>Coding in Progress</span>
            </motion.div>

            <motion.div
              className="flex flex-col md:flex-row items-center text-center md:text-left"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-yellow-500/10 p-3 rounded-full mb-2 md:mb-0 md:mr-3">
                <Hammer className="h-6 w-6 text-yellow-500" />
              </div>
              <span>Designing</span>
            </motion.div>

            <motion.div
              className="flex flex-col md:flex-row items-center text-center md:text-left"
              whileHover={{ scale: 1.05 }}
            >
              <div className="bg-yellow-500/10 p-3 rounded-full mb-2 md:mb-0 md:mr-3">
                <Sparkles className="h-6 w-6 text-yellow-500" />
              </div>
              <span>Polishing</span>
            </motion.div>
          </div>

          <div className="flex items-center justify-center text-yellow-500">
            <Clock className="h-5 w-5 mr-2" />
            <span>Coming Soon{dots}</span>
          </div>
        </motion.div>

        {/* Email Notification Section */}
        {/* <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700"
        >
          <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-slate-300 mb-4">
            We'll notify you when we launch. Leave your email below!
          </p>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            whileHover={{ scale: 1.02 }}
          >
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-500 text-slate-900 font-semibold rounded-lg px-6 py-3 flex items-center justify-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Notify Me
            </motion.button>
          </motion.div>
        </motion.div> */}

        {/* Infinite progress bar */}
        <motion.div
          className="mt-10 h-2 bg-slate-700 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div
            className="h-full bg-yellow-500"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </motion.div>
      </div>

      {/* Floating tools animation */}
      <div className="absolute inset-0 pointer-events-none">
        {tools.map((tool, index) => (
          <motion.div
            key={index}
            className="absolute text-2xl"
            style={{ left: tool.left, top: tool.top }}
            animate={{ y: [0, -20, 0], rotate: [0, 20, 0] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            {tool.emoji}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
