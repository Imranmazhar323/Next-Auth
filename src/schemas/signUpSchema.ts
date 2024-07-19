import { z } from "zod";

export const userNameValidator = z
  .string()
  .min(3, "username must to be at least 3 characters long")
  .max(20, "username must be at least 20 characters long")
  .regex(/^[a-zA-Z0-9]+$/, "username can only contain alphanumeric characters");

export const signUpSchema = z.object({
  username: userNameValidator,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50),
});
