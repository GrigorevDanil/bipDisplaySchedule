import { z } from "zod";

export const GetScheduleRequestSchema = z.object({
  group: z.string().min(1, "Group is required").trim(),
  serverAddress: z.string().min(1, "Server address is required").trim(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in yyyy-MM-dd format")
    .refine(
      (value) => {
        const date = Date.parse(value);

        return !isNaN(date);
      },
      {
        message: "Date must be a valid date in yyyy-MM-dd format",
      }
    ),
});
