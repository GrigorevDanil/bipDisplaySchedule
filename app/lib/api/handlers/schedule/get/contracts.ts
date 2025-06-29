import { z } from "zod";

import { GetScheduleRequestSchema } from "./validator";

export type GetScheduleRequest = z.infer<typeof GetScheduleRequestSchema>;
