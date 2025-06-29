import { NextRequest } from "next/server";

import { parseJsonRequest } from "../../lib/api/parserJsonRequest";
import { GetScheduleRequestSchema } from "../../lib/api/handlers/schedule/get/validator";
import {
  InternalServerError,
  InvalidData,
  Ok,
  Unauthorized,
} from "../../lib/api/responses";
import { handleGetSchedule } from "../../lib/api/handlers/schedule/get";
import { getCredentials } from "../../lib/api/getCredentials";

export const POST = async (request: NextRequest) => {
  try {
    const credentials = getCredentials(request);

    if (!credentials) return Unauthorized();

    const jsonRequest = await parseJsonRequest(request);

    const validation =
      await GetScheduleRequestSchema.safeParseAsync(jsonRequest);

    if (!validation.success) return InvalidData(validation.error.flatten());

    const { date: dateString, group, serverAddress } = validation.data;

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return InvalidData({ fieldErrors: { date: ["Invalid date format"] } });
    }

    const schedule = await handleGetSchedule(
      group,
      date,
      serverAddress,
      credentials.username,
      credentials.password
    );

    return Ok(schedule);
  } catch (error) {
    console.error("Error in POST handler:", error);

    return InternalServerError(error);
  }
};
