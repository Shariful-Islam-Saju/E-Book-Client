import { normalizeNumber } from "@/constants/Digit";
import { z } from "zod";

export const loginSchema = z.object({
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
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
