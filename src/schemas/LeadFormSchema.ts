import { z } from "zod";

// ✅ Normalize Bangla digits to English digits
const normalizeNumber = (input: string) => {
  const banglaDigits = "০১২৩৪৫৬৭৮৯";
  const englishDigits = "0123456789";
  return input.replace(
    /[০-৯]/g,
    (d) => englishDigits[banglaDigits.indexOf(d)] || d
  );
};

export const LeadFormSchema = z.object({
  name: z.string().max(50, "Name is too long").optional(),

  mobile: z
    .string()
    .nonempty("Mobile number is required")
    .transform(normalizeNumber) // ✅ Normalize before validation
    .refine((val) => {
      // Remove spaces or hyphens if needed
      const cleaned = val.replace(/[\s-]/g, "");

      // +8801XXXXXXXXX
      const plus880 = /^\+8801[3-9][0-9]{8}$/;

      // 8801XXXXXXXXX
      const withoutPlus = /^8801[3-9][0-9]{8}$/;

      // 01XXXXXXXXX
      const local = /^01[3-9][0-9]{8}$/;

      return (
        plus880.test(cleaned) ||
        withoutPlus.test(cleaned) ||
        local.test(cleaned)
      );
    }, "Invalid Bangladeshi mobile number"),

  address: z.string().max(200, "Address is too long").optional(),
});

export type LeadFormInputs = z.infer<typeof LeadFormSchema>;
