"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils"; // your `cn` utility

interface MaxWidthWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  maxWidth?: string; // custom max-width
  paddingX?: string; // custom horizontal padding
}

export const MaxWidthWrapper: React.FC<MaxWidthWrapperProps> = ({
  children,
  className,
  maxWidth = "max-w-7xl", // default max width
  paddingX = "px-4 sm:px-6 lg:px-8", // default responsive padding
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        "mx-auto w-full", // center and full width
        maxWidth,
        paddingX,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
