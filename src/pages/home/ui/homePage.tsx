"use client";

import { weekScheduleModel } from "@/entities/weekSchedule";
import { WeekScheduleItem } from "@/entities/weekSchedule/ui";
import { getGroups } from "@/shared/api/group";

import { ScheduleLayout } from "@/shared/ui/scheduleLayout";
import { HeaderSchedule } from "@/widgets/headerSchedule/index";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export const HomePage = observer(() => {
  const {
    store: { weekScheduleList, isLoading, getWeekSchedulesByGroups },
  } = weekScheduleModel;

  useEffect(() => {
    const setup = async () => {
      console.log(getGroups());
      //getWeekSchedulesByGroups([{ title: "ИП-4" }]);
    };

    setup();
  }, []);

  return (
    <ScheduleLayout>
      <HeaderSchedule />
      {isLoading ? (
        <div>123</div>
      ) : (
        weekScheduleList.map((item, index) => {
          return <WeekScheduleItem key={index} weekSchedule={item} />;
        })
      )}
    </ScheduleLayout>
  );
});
