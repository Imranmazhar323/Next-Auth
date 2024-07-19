import { z } from "zod";

export const messageSchema = {
  content: z
    .string()
    .min(1, "Message must be at least 1 character long")
    .max(1000, "Message must be at most 1000 characters long"),
};