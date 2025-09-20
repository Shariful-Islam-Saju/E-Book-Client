import React from "react";
import { motion } from "framer-motion";
import { DIGITS_EN } from "@/constants/Digit";

const DigitColumn: React.FC<{
  digit: number;
  height: number;
  duration?: number;
}> = ({ digit, height, duration = 10 }) => {
  const y = -digit * height;

  return (
    <div
      aria-hidden
      style={{
        height,
        width: "auto",
        overflow: "hidden",
        display: "inline-block",
        lineHeight: `${height}px`,
        textAlign: "center",
      }}
    >
      <motion.div
        initial={{ y }}
        animate={{ y }}
        transition={{ duration, ease: "easeInOut" }}
        style={{ display: "block" }}
      >
        {DIGITS_EN.map((d, i) => (
          <div
            key={i}
            style={{
              height,
              lineHeight: `${height}px`,
              fontFeatureSettings: "'tnum'",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {d}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default DigitColumn;
