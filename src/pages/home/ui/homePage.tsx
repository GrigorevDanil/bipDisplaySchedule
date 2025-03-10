"use client";

import { ScheduleLayout } from "@/shared/ui/scheduleLayout";
import { HeaderSchedule } from "@/widgets/headerSchedule/index";
import { WeekSchedule } from "@/widgets/weekSchedule";

export const HomePage = () => {
  return (
    <ScheduleLayout>
      <HeaderSchedule />
      <WeekSchedule group="ОЗФО-4б" />
      <WeekSchedule group="ОЗФО-4б" />
      <WeekSchedule group="ОЗФО-4б" />
      <WeekSchedule group="ОЗФО-4б" />
      <WeekSchedule group="ОЗФО-4б" />
      <WeekSchedule group="ОЗФО-4б" />
      <WeekSchedule group="ОЗФО-4б" />
      <WeekSchedule group="ОЗФО-4б" />
      <WeekSchedule group="ОЗФО-4б" />
      <WeekSchedule group="ОЗФО-4б" />
    </ScheduleLayout>
  );
};
