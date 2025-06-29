import { NextRequest } from "next/server";

import { handleGetGroups } from "../../lib/api/handlers/group/get";
import { parseJsonRequest } from "../../lib/api/parserJsonRequest";
import { GetGroupsRequestSchema } from "../../lib/api/handlers/group/get/validator";
import {
  InternalServerError,
  InvalidData,
  Ok,
  Unauthorized,
} from "../../lib/api/responses";
import { getCredentials } from "../../lib/api/getCredentials";

export const POST = async (request: NextRequest) => {
  try {
    const credentials = getCredentials(request);

    if (!credentials) return Unauthorized();

    const jsonRequest = await parseJsonRequest(request);

    const validation = await GetGroupsRequestSchema.safeParseAsync(jsonRequest);

    if (!validation.success) return InvalidData(validation.error.flatten());

    const { serverAddress } = validation.data;

    const groups = await handleGetGroups(
      serverAddress,
      credentials.username,
      credentials.password
    );

    return Ok(groups);
  } catch (error) {
    return InternalServerError(error);
  }
};
