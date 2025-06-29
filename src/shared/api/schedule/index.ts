import { format } from "date-fns";
import moment from "moment";

import { httpClientApp } from "../httpClient";
import { Group } from "../group/type";

import { Schedule, ScheduleByGroup } from "./type";

import { getWorkDate } from "@/shared/lib/time";

export const getSchedule = async (
  group: string,
  date: Date,
  serverAddress: string
): Promise<Schedule> => {
  try {
    const formattedDate = format(date, "yyyy-MM-dd");
    const response = await httpClientApp.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/schedule`,
      { group, date: formattedDate, serverAddress }
    );

    return response.data;
  } catch (error) {
    console.error("Ошибка в getSchedule:", error);
    throw error;
  }
};

export const getWeekScheduleByGroups = async (
  groups: Group[],
  serverAddress: string
): Promise<ScheduleByGroup[]> => {
  try {
    const now = moment(getWorkDate());
    const startOfWeek = now.clone().startOf("isoWeek");

    const workDays = Array.from({ length: 6 }, (_, i) =>
      startOfWeek.clone().add(i, "days").toDate()
    );

    const results = await Promise.all(
      groups.map(async (group) => {
        const schedules = await Promise.all(
          workDays.map(async (day) => {
            try {
              return await getSchedule(group.title, day, serverAddress);
            } catch {
              return { date: day, items: [] };
            }
          })
        );

        return {
          group: group.title,
          items: schedules,
        };
      })
    );

    return results;
  } catch (error) {
    throw error;
  }
};
