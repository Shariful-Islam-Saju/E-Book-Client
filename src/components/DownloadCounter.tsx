"use client";

import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { Download, TrendingUp } from "lucide-react";

const LOCAL_STORAGE_KEY = "download_counter";

const DownloadCounter: React.FC = () => {
  // Load initial value from localStorage or generate random
  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) return parseInt(stored, 10);
    }
    // Random starting value between 10,000 and 200,000
    return Math.floor(Math.random() * (200000 - 10000 + 1)) + 10000;
  };

  const [count, setCount] = useState(getInitialValue);
  const [previousCount, setPreviousCount] = useState(count);
  const [isIncreasing, setIsIncreasing] = useState(true);

  // Update localStorage whenever count changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, count.toString());
    }
  }, [count]);

  useEffect(() => {
    // Increment the counter every 5 seconds by random 2-5
    const interval = setInterval(() => {
      const increment = Math.floor(Math.random() * (5 - 2 + 1)) + 2;
      setPreviousCount(count);
      setIsIncreasing(true);
      setCount((prev) => {
        const newValue = prev + increment;
        // Update localStorage immediately when incrementing
        localStorage.setItem(LOCAL_STORAGE_KEY, newValue.toString());
        return newValue;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [count]);

  return (
    <div className="flex flex-col bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto border border-gray-100 transform transition-all duration-300 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Total Downloads</h2>
        <div className="flex items-center text-sm bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
          <TrendingUp size={14} className="mr-1" />
          <span>Live</span>
        </div>
      </div>

      {/* Main Counter */}
      <div className="flex items-end justify-between">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm mr-4">
            <Download className="w-6 h-6 text-white" />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">
              Downloads
            </p>
            <h3 className="text-2xl font-bold text-gray-800">
              <CountUp
                start={previousCount}
                end={count}
                duration={1.5}
                separator=","
                preserveValue
                onEnd={() => setIsIncreasing(false)}
              />
            </h3>
          </div>
        </div>

        {/* Animated change indicator */}
        <div
          className={`flex items-center text-sm font-medium px-2 py-1 rounded-md mb-1 ${
            isIncreasing
              ? "bg-green-100 text-green-700 animate-pulse"
              : "bg-gray-100 text-gray-700"
          } transition-all duration-300`}
        >
          {isIncreasing && (
            <>
              <TrendingUp size={14} className="mr-1" />
              <span>+{count - previousCount}</span>
            </>
          )}
        </div>
      </div>



    
    </div>
  );
};

export default DownloadCounter;
