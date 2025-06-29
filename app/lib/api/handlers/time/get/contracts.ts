import { z } from "zod";

import { GetTimeSchedulesRequestSchema } from "./validator";

export type GetTimeSchedulesRequest = z.infer<
  typeof GetTimeSchedulesRequestSchema
>;
