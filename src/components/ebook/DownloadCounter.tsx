"use client";

import React, { useEffect, useRef, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Hind_Siliguri } from "next/font/google";
import DigitColumn from "../DigitColumn";
import DIGITS_BN from "@/constants/DigitBN";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "700"],
});

const LOCAL_STORAGE_KEY = "download_counter";



const DownloadCounter: React.FC = () => {
  // শুরু মান (localStorage বা র‍্যান্ডম রেঞ্জ)
  const getInitialValue = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) return parseInt(stored, 10);
    }
    return Math.floor(Math.random() * (20000 - 5000 + 1)) + 5000; // ৫০০০-২০০০০
  };

  const [count, setCount] = useState<number>(() => getInitialValue());
  const [lastIncrement, setLastIncrement] = useState<number>(0);

  // localStorage এ সেভ
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, String(count));
    }
  }, [count]);

  // প্রতি ৫ সেকেন্ডে ইনক্রিমেন্ট
  useEffect(() => {
    const id = setInterval(() => {
      const inc = Math.floor(Math.random() * 4) + 2; // ২–৫
      setCount((s) => s + inc);
      setLastIncrement(inc);
    }, 5000);

    return () => clearInterval(id);
  }, []);

  // সংখ্যাকে ডিজিট অ্যারে (left padded না করা) — পরে আমরা left-align না করেই দেখাবো
  const toDigitArray = (n: number) =>
    n
      .toString()
      .split("")
      .map((ch) => parseInt(ch, 10));

  const digits = toDigitArray(count);

  // বাংলা সংখ্যায় কনভার্টার (বাজ / সাবটেক্সটে ব্যবহার)
  const toBangla = (num: number) =>
    num.toString().replace(/[0-9]/g, (d) => DIGITS_BN[parseInt(d, 10)]);

  // ডিজিট তুলনা/রেন্ডার হাইট
  const DIGIT_HEIGHT = 36; // px - দরকারমত বাড়াও/নামাও

  return (
    <div
      className={`${hindSiliguri.className} flex flex-col bg-white rounded-2xl shadow-xl p-6 max-w-md mx-auto border border-gray-100 hover:shadow-2xl transition-all duration-500`}
    >
      {/* হেডার */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">মোট ডাউনলোড</h2>
        <div className="flex items-center text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          <TrendingUp size={14} className="mr-1" />
          <span>লাইভ</span>
        </div>
      </div>

      {/* কাউন্টার: প্রতিটি ডিজিট আলাদা কলামে */}
      <div
        className="flex items-center justify-between  font-extrabold text-gray-900  py-3"
        style={{ fontSize: 28, height: DIGIT_HEIGHT }}
        aria-live="polite"
        aria-label={`মোট ডাউনলোড ${toBangla(count)}`}
      >
        {/* ডিজিটগুলোর flex container */}
        <div className="flex items-center gap-1 h-full">
          {digits.map((d, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center"
              style={{ width: 20, height: DIGIT_HEIGHT }}
            >
              <DigitColumn digit={d} height={DIGIT_HEIGHT} duration={2} />
            </div>
          ))}
        </div>

        {/* ইনক্রিমেন্ট ব্যাজ */}
        <div className="text-sm font-semibold px-3 py-1 rounded-lg bg-green-100 text-green-700 shadow-md">
          +{toBangla(lastIncrement)}
        </div>
      </div>
    </div>
  );
};

export default DownloadCounter;
