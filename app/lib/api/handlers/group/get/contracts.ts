import { z } from "zod";

import { GetGroupsRequestSchema } from "./validator";

export type GetGroupsRequest = z.infer<typeof GetGroupsRequestSchema>;
