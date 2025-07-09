import { z } from "zod";

export const ContactSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First Name is required" })
    .min(3, { message: "First Name must be at least 3 characters" }),
  lastName: z.string(),
  email: z.string().email({ message: "Enter valid email address" }),
  message: z
    .string()
    .min(1, { message: "Message is required" })
    .min(20, { message: "Message must be at least 20 character" }),
});
