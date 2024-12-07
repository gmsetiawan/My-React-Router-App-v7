import { z } from "zod";

export const todoSchema = z.object({
  description: z.string().min(8).max(128),
  status: z.boolean().default(false),
});
