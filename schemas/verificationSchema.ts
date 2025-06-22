import * as z from "zod";

export const verificationCode = z.object({
  code: z
    .string()
    .min(1, { message: "Verification code is required" })
    .min(6, { message: "Please enter 6 digit verification code" }),
});
