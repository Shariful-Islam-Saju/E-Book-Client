"use client";

import { useEffect, useState } from "react";
import FlipNumbers from "react-flip-numbers";
import { Download, TrendingUp } from "lucide-react";

const LOCAL_STORAGE_KEY = "download_counter";

const DownloadCounter: React.FC = () => {
  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) return parseInt(stored, 10);
    }
    return Math.floor(Math.random() * (150000 - 10000 + 1)) + 10000;
  };

  const [count, setCount] = useState(getInitialValue);

  // Save to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, count.toString());
    }
  }, [count]);

  // Auto increment every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * (5 - 2 + 1)) + 2;
      setCount((prev) => prev + increment);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto border border-gray-100 hover:shadow-2xl transition-all duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Total Downloads</h2>
        <div className="flex items-center text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          <TrendingUp size={14} className="mr-1" />
          <span>Live</span>
        </div>
      </div>

      {/* Main Counter */}
      <div className="flex items-end justify-between">
        <div className="flex items-center">
          {/* Icon */}
          <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md mr-5">
            <Download className="w-7 h-7 text-white" />
          </div>

          {/* Counter */}
          <div>

            <div className="flex items-center justify-between gap-4 font-extrabold tracking-tight text-gray-900 text-[25px]">
              <FlipNumbers
                height={20} // size of the digits
                width={20} // width of each digit
                color="#111827" // dark color
                background="transparent"
                play
                perspective={1200} // smooth 3D effect
                numbers={count.toString()}
                duration={5} // very slow
                delay={0.1} // smooth flip
              />
              <div className="flex items-center text-sm font-semibold px-3 py-1 rounded-lg bg-green-100 text-green-700 shadow-md animate-pulse">
                <TrendingUp size={14} className="mr-1" />+
                {Math.floor(Math.random() * 4) + 2}
              </div>
            </div>
          </div>
        </div>

        {/* Change indicator */}
      </div>
    </div>
  );
};

export default DownloadCounter;
