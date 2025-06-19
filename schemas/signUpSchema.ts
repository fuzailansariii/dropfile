import * as z from "zod";

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: "Email is required!" })
      .email({ message: "Please enter valid email" }),
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string().min(1, { message: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });
