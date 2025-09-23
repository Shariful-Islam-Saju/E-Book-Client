"use client";

import React, { useEffect, useState } from "react";
import { Hind_Siliguri } from "next/font/google";
import DigitColumn from "../../utils/DigitColumn";
import { DIGITS_EN } from "@/constants/Digit";
import { LOCAL_STORAGE_KEY } from "@/constants/LocalStoreKey";
import { getInitialValue } from "@/utils/getRandomNumber";

const hindSiliguri = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "700"],
});

const DownloadCounter: React.FC = () => {
  // শুরু মান (localStorage বা র‍্যান্ডম রেঞ্জ)
  const [count, setCount] = useState<number>(() => getInitialValue());

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
    }, 5000);

    return () => clearInterval(id);
  }, []);

  // 8-digit array (leading zeros if needed)
  const toDigitArray = (n: number) => {
    const str = n.toString().padStart(7, "0"); // always 8 digits
    return str.split("").map((ch) => parseInt(ch, 10));
  };

  const digits = toDigitArray(count);

  // বাংলা সংখ্যায় কনভার্টার (বাজ / সাবটেক্সটে ব্যবহার)
  const toBangla = (num: number) =>
    num.toString().replace(/[0-9]/g, (d) => DIGITS_EN[parseInt(d, 10)]);

  // ডিজিট তুলনা/রেন্ডার হাইট
  const DIGIT_HEIGHT = 45; // px - দরকারমত বাড়াও/নামাও

  return (
    <div className={`${hindSiliguri.className}`}>
      {/* হেডার */}
      <div className="flex items-center justify-between mb-6 z-30">
        <div />
        <h2 className="text-xl font-bold text-gray-800">
          এ পর্যন্ত যতজন ডাউনলোড করেছেন
        </h2>
        {/* LIVE badge */}
        <div className="flex items-center">
          <span className="bg-red-600 text-white ml-2 px-2 py-0.5 rounded font-semibold text-sm animate-pulse">
            LIVE
          </span>
        </div>
      </div>

      {/* কাউন্টার: প্রতিটি ডিজিট আলাদা কলামে */}
      <div
        className="flex z-30 flex-col w-full mx-3 items-center font-extrabold text-gray-900 py-3"
        style={{ fontSize: 40, height: DIGIT_HEIGHT }}
        aria-live="polite"
        aria-label={`মোট ডাউনলোড ${toBangla(count)}`}
      >
        {/* ডিজিটগুলোর flex container */}
        <div className="flex items-center w-full px-3 justify-around h-full mb-2">
          {digits.map((d, idx) => (
            <div key={idx} className="flex items-center justify-center">
              <DigitColumn digit={d} height={DIGIT_HEIGHT} duration={2} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DownloadCounter;
