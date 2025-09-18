import { z } from "zod";

export const LeadFormSchema = z.object({
  name: z.string().max(50, "Name is too long").optional(), // now optional

  mobile: z
    .string()
    .nonempty("Mobile number is required")
    .regex(/^01[3-9][0-9]{8}$/, "Invalid Bangladeshi mobile number"),

  address: z.string().max(200, "Address is too long").optional(),
});

export type LeadFormInputs = z.infer<typeof LeadFormSchema>;
