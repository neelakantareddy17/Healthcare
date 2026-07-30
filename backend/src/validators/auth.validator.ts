import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50),

  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),

  phone: z
    .string()
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

  
});

export const loginSchema = z.object({
  email: z
    .email("Invalid email address")
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8),
});