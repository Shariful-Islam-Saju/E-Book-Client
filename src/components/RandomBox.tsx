"use client";

import React from "react";
import { motion } from "framer-motion";

// helper function to generate smooth random paths
const randomPath = (steps: number, maxOffset: number) =>
  Array.from(
    { length: steps },
    () => Math.random() * maxOffset - maxOffset / 2
  );

const RandomBox = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
      {[...Array(50)].map((_, i) => {
        const size = Math.random() * 100 + 50; // 50px - 150px
        const duration = Math.random() * 10 + 20; // 10s - 20s

        // Random border-radius for normal shapes
        const borderRadiusOptions = [
          "0%", // square
          "50%", // circle
          "20%", // rounded square
          "30% 70% 70% 30% / 30% 30% 70% 70%", // blob-like
          "70% 30% 30% 70% / 60% 40% 60% 40%", // irregular blob
        ];
        const borderRadius =
          borderRadiusOptions[
            Math.floor(Math.random() * borderRadiusOptions.length)
          ];

        const xPath = randomPath(5, 300);
        const yPath = randomPath(5, 300);

        return (
          <motion.div
            key={i}
            className="absolute opacity-10" // 🔹 made more transparent
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius,
              background: `linear-gradient(45deg, ${
                i % 3 === 0 ? "#ff9a9e" : i % 3 === 1 ? "#a1c4fd" : "#c2e9fb"
              })`,
            }}
            animate={{
              x: xPath,
              y: yPath,
              scale: [1, 1 + Math.random() * 0.3, 1],
              rotate: [0, Math.random() * 360, 0],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatType: "mirror", // smooth infinite motion
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default RandomBox;
