import { z } from "zod";

export const GetGroupsRequestSchema = z.object({
  serverAddress: z.string().min(1, "Server address is required").trim(),
});
