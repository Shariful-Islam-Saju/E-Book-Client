"use client";

import React from "react";
import { motion } from "framer-motion";
import RandomBox from "@/components/RandomBox";
import LoginForm from "@/components/login/LoginForm";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <RandomBox />

      {/* floating nature svg, glow, footer etc. keep your same UI here */}

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/30 overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center">
            {/* logo + header text */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-2xl font-bold text-white"
            >
              Digital Seba
            </motion.h1>
            <p className="text-green-100 mt-2">
              Sign in to access your account
            </p>
          </div>

          <div className="p-8">
            <LoginForm />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
