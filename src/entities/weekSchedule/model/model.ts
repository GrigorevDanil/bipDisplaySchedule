import { Schedule } from "@/shared/api/schedule/model";

export type WeekSchedule = {
  group: string;
  schedules: Schedule[];
};
