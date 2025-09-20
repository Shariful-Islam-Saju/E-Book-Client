import { LOCAL_STORAGE_KEY } from "@/constants/LocalStoreKey";

// Utility function
export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getInitialValue = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) return parseInt(stored, 10);
  }
  // এখানে utility function ব্যবহার করা হলো
  return getRandomNumber(15000, 20000);
};
