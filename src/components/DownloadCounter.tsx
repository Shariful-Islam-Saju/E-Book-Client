"use client";
import { useState } from "react";

const DownloadCounter: React.FC<{ ebookId: string }> = ({ ebookId }) => {
  const time = new Date().getTime();
  console.log(time)
  const [downloadCount] = useState(Math.floor(Math.random() * 10000) + 1000);

  return <span>{downloadCount.toLocaleString()} downloads</span>;
};

export default DownloadCounter;