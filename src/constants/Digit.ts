export const  DIGITS_BN = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
export const DIGITS_EN = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

export const normalizeNumber = (input: string) => {
  const banglaDigits = "০১২৩৪৫৬৭৮৯";
  const englishDigits = "0123456789";
  return input.replace(
    /[০-৯]/g,
    (d) => englishDigits[banglaDigits.indexOf(d)] || d
  );
};