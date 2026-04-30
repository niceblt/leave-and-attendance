import * as z from "zod";

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .max(30, "Password must be at most 30"),
});
