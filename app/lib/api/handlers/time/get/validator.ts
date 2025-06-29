import { z } from "zod";

export const GetTimeSchedulesRequestSchema = z.object({
  serverAddress: z.string().min(1, "Server address is required").trim(),
  date: z.date(),
});
