import * as z from "zod";

export const signInScheama = z.object({
  email: z
    .string()
    .min(1, { message: "Email is requried" })
    .email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(1, { message: "Password is required" })
    .min(6, { message: "Password must be at least 6 characters" }),
});
