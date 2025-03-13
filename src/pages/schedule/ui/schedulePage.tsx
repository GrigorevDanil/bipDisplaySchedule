"use client";

import { weekScheduleModel } from "@/entities/weekSchedule";
import { WeekScheduleItem } from "@/entities/weekSchedule/ui";
import { getGroups } from "@/shared/api/group";
import { BaseLayout } from "@/shared/ui/baseLayout";

import { HeaderSchedule } from "@/widgets/headerSchedule/index";
import { Spinner } from "@heroui/spinner";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export const SchedulePage = observer(() => {
  const {
    store: { weekScheduleList, isLoading, getWeekSchedulesByGroups },
  } = weekScheduleModel;

  useEffect(() => {
    const setup = async () => {
      getWeekSchedulesByGroups([
        { title: "ИП-4" },
        { title: "Ф-4Б" },
        { title: "ИС-1А" },
      ]);
    };

    setup();
  }, []);

  return (
    <BaseLayout>
      <HeaderSchedule />
      {isLoading ? (
        <Spinner className="m-auto" color="default" size="lg" />
      ) : (
        weekScheduleList.map((item, index) => {
          return <WeekScheduleItem key={index} weekSchedule={item} />;
        })
      )}
    </BaseLayout>
  );
});
