"use client";

import { weekScheduleModel } from "@/entities/weekSchedule";
import { WeekScheduleItem } from "@/entities/weekSchedule/ui";
import { Collection } from "@/shared/api/group/model";
import { getItem } from "@/shared/lib/storage";
import { ScheduleLayout } from "@/shared/ui/scheduleLayout";

import { HeaderSchedule } from "@/widgets/headerSchedule/index";
import { Spinner } from "@heroui/spinner";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

export const SchedulePage = observer(
  ({ params }: { params: Record<string, string> }) => {
    const { id } = params;

    const {
      store: { weekScheduleList, isLoading, getWeekSchedulesByGroups },
    } = weekScheduleModel;

    useEffect(() => {
      const setup = async () => {
        const json = getItem("collections");
        if (json) {
          const collections: Collection[] = JSON.parse(json);
          const groups = collections.find(
            (item) => item.id.toString() === id
          )?.groups;

          getWeekSchedulesByGroups(groups!);
        }
      };

      setup();
    }, []);

    return (
      <ScheduleLayout>
        <HeaderSchedule />
        {isLoading ? (
          <Spinner className="m-auto" color="default" size="lg" />
        ) : (
          weekScheduleList.map((item, index) => {
            return <WeekScheduleItem key={index} weekSchedule={item} />;
          })
        )}
      </ScheduleLayout>
    );
  }
);
